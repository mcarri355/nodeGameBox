const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url,{
        //options to change the connection of the url
    })
}

module.exports = connectDB