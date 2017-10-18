"use strict";

const userModel = require('../../models/user');
const communityModel = require('../../models/community');

const User = new userModel.UserActions();

class API {
    getUser(req, res)
    {
        let who =
        {
            nick: req.query.nick || null,
            email: req.query.email || null,
            id: req.query.id || null
        }

        User.getUser({$or:[{email: who.email}, {nick: who.nick}, {_id: who.id}]}, (ok, data) =>
        {
            if(ok) return res.status(200).send(data);
            return res.status(400).send(data); 
        });
    }

    getUsers(req, res, next)
    {
        User.getAllUsers((ok, data) =>  
        {
            if(ok) return res.status(200).send(data);
            return res.status(500).send(data);
        });
    }
}

module.exports = API;
