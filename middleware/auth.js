const authorize = (req,res,next) => {
    //an example of how API keys can be used.
    //Not for real use , this is a small example

    const {apiKey} = req.query
    if(apiKey === 'ping') {
        console.log('Authorize Access Granted')
        //This modifes the req obj for the next res
        req.user = {name: 'Jimmy John', id:123456}
        next()
    }else{
        console.log('Authorize Access Denied')
        res.send({results:[], status:404, message: "Access Denied"})
        //next() don't push them onto a responses if they fail the auth check
    }
}

module.exports = authorize