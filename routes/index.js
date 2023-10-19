const express = require('express')
const router = express.Router()
const ensureAuthenticated = require("../config/auth")
// const myScript = require('views/public/script.js')

//home page
router.get('/',(req, res) => {
    res.render('pages/welcome', {
        // utils: myScript
    });
})

//dashboard-homepage redirect
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('pages/dashboard', {
        user:req.user
    })
})

router.get('/game', ensureAuthenticated, (req, res) => {
    res.render('pages/game', {
        user:req.user
    });
})

//if they are logged in then it displayes the dashboard and which coninsides with the passpoart serialized and deserialized
module.exports = router