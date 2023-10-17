//required var and dev tools
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const passport = require('passport');
require("./config/passport")(passport);
require("dotenv").config();
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEJSLayout = require('express-ejs-layouts');

try{
   mongoose.connect(process.env.MONGO_URI, {useNewURLParser:true, useUnifiedTopology:true})//directly connects
   .then(()=> {console.log(`connect on port: ${process.env.PORT}`)})
   .catch((err)=>{console.log(err)})
}catch(error){
    // console.log(error)
}

//development tools
app.use(morgan('tiny'))

//EJS
app.set('view engine', 'ejs')//automatically loads to the views folder
app.use(expressEJSLayout)

//body-parser(format)
app.use(express.urlencoded({ extended: false }))

//express session
app.use(session({//hash with a specail id
    secret: process.env.SESSION_SECRET,//masterkey access any session
    resave: true,
    saveUnitialized: true//undoes the hash so they can view session
}))
app.use(passport.initialize())
app.use(passport.session())

//use flash messaging --express
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('sucess message');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/public', express.static('./views/public'));

app.listen(process.env.PORT || 5000);//set to whatever port set in process.env