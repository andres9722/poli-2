"use strict";

const userModel = require('../../models/user'),
    communityModel = require('../../models/community'),
    hash = require('../../services/hash');

const User = new userModel.UserActions();
const Community = new communityModel.CommunityActions();

const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

class UserCtrl
{
    signupUser(req,res) {
        let newUser= new userModel.user(
        {
            email : req.body.email,
            nick : req.body.nick,
            name : req.body.name,
            second_name : req.body.second_name || '',
            last_name : req.body.last_name,
            second_last_name: req.body.second_last_name || '',
            password : req.body.password,
            gender: req.body.gender,
            avatar: req.body.avatar || '',
            lastLogin: Date.now()
        });

        if((newUser.email).includes (' ') ||
            (newUser.nick).includes (' ') ||
            (newUser.gender).includes (' ') ||
            (newUser.avatar).includes (' ') ||
            !emailRegex.test(newUser.email)
        ) return res.status(400).send({error:"Formating error"});
        
        User.registerUser(newUser, (ok, msg) =>
        {
            (ok) ? res.status(200).send({message:msg.message, token: hash.createToken(newUser)}) : res.status(400).send(msg)
        });
    }

    signupUserCommunity(req,res) {
        if((req.body.nick || req.body.email) && (req.body.name || req.body.inv_token)) {
            User.getUser({$or:[{email:req.body.email},{nick:req.body.nick}]}, (ok,msgUser) => {
                if(ok) {
                    Community.getCommunity({$or:[{inv_token:req.body.inv_token},{name:req.body.name}]},(ok,msgCommunity)=> {
                        if(ok) { 
                            if((msgCommunity.users.indexOf(msgUser._id)) < 0) {
                                switch(msgCommunity.privacy) {
                                    case "OPEN": {
                                        Community.registerUser({$or:[{name:msgCommunity.name},{inv_token:msgCommunity.inv_token}]}, {"$addToSet":{users:msgUser._id}},(ok,obj)=>  {
                                            if(ok) return res.status(200).send({message:"User added to community"});
                                            return res.status(500).send({error:obj});
                                        });
                                    } break;
                                    
                                    case "PUBLIC": {
                                        Community.registerRequest({$or:[{name:msgCommunity.name},{inv_token:msgCommunity.inv_token}]}, {"$addToSet":{requests:msgUser._id}},(ok,obj)=> {
                                                if(ok) return res.status(200).send({message:"Request sent"});
                                                return res.status(500).send({error:obj});
                                        });
                                    } break;
                                    
                                    case "PRIVATE": {
                                        if(req.body.inv_token && req.body.inv_token===msgCommunity.inv_token)  {
                                            Community.registerRequest({$or:[{name:msgCommunity.name},{inv_token:msgCommunity.inv_token}]}, {"$addToSet":{requests:msgUser._id}},(ok,obj)=> {
                                                if(ok) return res.status(200).send({message:"Request sent"});
                                                return res.status(500).send({error:obj});
                                            });

                                        } else res.status(400).send({message:"Need an invitation token"});
                                    } break;
                                }
                            } else return res.status(200).send({message:"User is already a member"});
                        } else return res.status(404).send({message:"Community doesn't exist"});
                    });
                } else return res.status(404).send({message:"User doesn't exist"});
            });
        } else return res.status(400).send({message:'Need a correct request body'});
    }
    
    loginUser(req,res,next) {
        if((req.body.nick || req.body.email) && req.body.password)
        {
            User.passUser(req.body, (ok,msg) =>
            {
                if(ok)
                {
                    req.user = msg;
                    let token = hash.createToken(msg);
                    return res.status(200).send({info: "Logged  "+ msg.email, token: token});
                    
                }else return res.status(400).send({info: msg});
            });
        }else return res.status(400).send({error:"Need to provide a correct request body"});
    }
    
    updateUser(req, res) {        
        User.getUser({email: req.user.email}, (ok, msgUser) =>
        {
            if(ok)
            {
                let newUser = new userModel.user({
                    email : req.body.email,
                    nick : req.body.nick,
                    name : req.body.name,
                    second_name : req.body.second_name || '',
                    last_name : req.body.last_name,
                    second_last_name: req.body.second_last_name || '',
                    gender: req.body.gender,
                    avatar: req.body.avatar || '',
                    lastLogin: Date.now()
                });

                if((newUser.email).includes (' ') ||
                (newUser.nick).includes (' ') ||
                (newUser.gender).includes (' ') ||
                (newUser.avatar).includes (' ') ||
                !emailRegex.test(newUser.email)
                ) return res.status(400).send({error:"Formating error"});

                User.updateUser({email: newUser.email,
                    nick: newUser.nick,
                    name: newUser.name,
                    second_name: newUser.second_name,
                    last_name: newUser.last_name,
                    second_last_name: newUser.second_last_name,
                    gender: newUser.gender,
                    avatar: newUser.avatar || '',
                    lastLogin: Date.now()}, 
                    (ok, obj) => { 
                        (ok) ? res.status(200).send({message: obj, token: hash.createToken(newUser)}) : res.status(500).send({error: obj}); 
                    })
            } else res.status(500).send({message:"Error to updated user"})
        })
    }

    deleteUser(req, res) { 
        User.getUser({email: req.user.email}, (ok, msgUser) => {
            if(ok) {
                User.removeUser({email: msgUser.email}, (ok, obj) => {
                    (ok) ? res.status(200).send({message: "User deleted"}) : res.status(500).send({err: obj})
                })
            } else res.status(500).send({message: msgUser})
        })
    }

    deleteUserCommunity(req, res) {
        
    }
}

module.exports = UserCtrl;
