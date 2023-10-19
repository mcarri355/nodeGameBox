const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');//import from models

//login page
router.get('/login', (req, res)=>{
    res.render('pages/login')
})

//register page
router.get('/register', (req, res)=>{
    res.render('pages/register')
})

// // Assuming you have a list of top users in your server
// const topUsers = [
//     { first_name: "User1", last_name: "Lastname1", points: 100 },
//     { first_name: "User2", last_name: "Lastname2", points: 90 },
//     // ... Add more users as needed
// ];

// // Set up an endpoint to serve the top users as JSON
// app.get("/api/top-users", (req, res) => {
//     // You can sort your topUsers list by points here
//     const sortedTopUsers = topUsers.sort((a, b) => b.points - a.points).slice(0, 10);
//     res.json({ topUsers: sortedTopUsers });
// });

//register handle
router.post('/register', (req, res)=>{
    const {first_name, last_name, email, password, password2} = req.body;//pulls out all of the fields of information
    let errors = [];//creat an empty array
    // console.log(first_name, last_name, email, password, password2);
    if(!first_name || !last_name || !email || !password || !password2){//checks that all the fields are fielded out
        errors.push({msg: "Please fill in all fields"})
    }
    // check if passwords match
    if(password !== password2){
        errors.push({msg: "Passwords do not match"})
    }

    // check if password is less than 6 characters
    if(password.length < 6){
        errors.push({msg: "Password needs to be at least 6 characters"})//makes sure the passord is at least 6 characters
    }

    if(errors.length > 0){
        console.log(errors)
        res.render('register', {//if any errors then render reigster page with errors and the infromation they gave 
            //you can refill the form or make a confirmation pages
            errors: errors,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password
        })
    } else {//validation passed and more validation
        User.findOne({email: email}).then((err, user)=>{
            if(user){
                errors.push({msg: "This email has aleady been registered"})//renders error with all the infromation
                console.log(errors)
                res.render('pages/register', {
                    errors: errors,
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password,
                    password2: password2
                })//makes sure that the account abou to be wrote doesn't overwrite or have an account

            } else {//if not then creates the new user
                const newUser = new User({//new object that follows the model
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    password: password
                })//account creation is different form account completion(picture and description)

                //hash password(created an encripted the password)
                bcrypt.genSalt(10, (err, salt)=>
                bcrypt.hash(newUser.password,salt,
                    ((err,hash)=> {
                        if(err) throw err;
                        // save pass to hash
                        newUser.password = hash
                        newUser.save()//save entire user data to database
                        //.save() is a mongoose function
                        .then((value)=>{
                            //console.log(value);
                            req.flash('success_msg', 'You have are nowregistered!')
                            res.redirect('/users/login')//if they successfully created an account then they get this messages
                        })
                        .catch(value=> console.log("value: account creation failed"))//if they havent then they get a failure message
                    })
                    )//.then is like a await function
                    //.then,.catch is a promise of completion
                    //an async function, and infinite chaining
                )
            }
        })
    }
})

router.post('/login', (req,res,next)=>{//post information to login and redirect to dashboard if succesfful
    //if not then redirects then to the login and will flash a message 
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req,res,next);
})

router.get('/logout', (req, res)=>{//when the user is logged out it returns then to the main page
    req.logout(function(err){
        if(err) {return next(err)}
    })
    res.redirect('/')
})

module.exports = router;