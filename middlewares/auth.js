"use strict";

const hash = require('../services/hash');

function isAuth( req, res, next)
{    
    var token;
    if(req.headers.authorization)
        token = req.headers.authorization.split(" ")[0];      
    else
        return res.status(500).send({error: "You need to Login first"}); 
        
    hash.decodeToken(token).then(response =>
    {
//         console.log(response._doc);
        req.user = response;
        next();
        
    })
    .catch(response => 
    {
        res.status(response.status).send(response.message);
    })
}

module.exports = isAuth;
