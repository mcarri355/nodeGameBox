const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user')

//used for authrorization like an oath for google auth and verifies who you are

module.exports = function (passport){
    passport.use(new LocalStrategy({usernameField:'email', passwordField:'password', passReqToCallback: false, session:true}, (email,password,done)=>{
        console.log('Local Strat Works')
        //match user
        User.findOne({email: email})
        .then((user)=>{
            if(!user){
                return done(null, false, {message: 'That email address is not registered'})
            }
            //match pass
            bcrypt.compare(password, user.password, (err, isMatch)=>{
                if(err) throw err;
                if(isMatch){
                    console.log(email + " " + password)
                    return done(null, user);
                }else{
                    return done(null, false, {message: 'Pass Incorrect'})
                }
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }))

    //These are to handle the login sessions
    passport.serializeUser(function(user,done){
        done(null, user.id);
    });//createss new session 
    
    //using passport creates a deserialize user and saves the request
    //verify if you can log in or not
    passport.deserializeUser(function(id,done){
        User.findById(id).then((user,err)=>{
            console.log(err)
            if(err) return done (err);
            done(err, user);
        }).catch((err)=>{console.log(err)})
    });//find the user and save the session to who you are
}