"use strict";

const communityModel = require('../../models/community'),
    groupModel = require('../../models/group');

const Community = new communityModel.CommunityActions();

class CommunityCtrl
{
    signupCommunity(req,res)
    {
        if(req.user.id)
        {
            let newCommunity =
            {
                name : req.body.name,
                title : req.body.title || req.body.name,
                description : req.body.description || '',
                logo: req.body.logo || '',
                creator: req.user.id,
                inv_token: Community.generateCommunityToken(req.body.name),
                user_admin:req.body.user_admin?(req.body.user_admin).split(","):[],
                user_moderator: req.body.user_moderator? (req.body.user_moderator).split(",") : [],
                privacy: req.body.privacy
            };
            if(newCommunity.name.includes (' ') || newCommunity.logo.includes (' ')) return res.status(400).send("The name can't have spaces");
            Community.registerCommunity(newCommunity,(ok,msg)=>
            {
                if(ok) return res.status(200).send({info:msg,name: newCommunity.name,inv_token:newCommunity.inv_token});

                return res.status(400).send(msg);
            });
        } else return res.status(500).send({message: "Something wrong happened"});
    }    

    updateCommunity(req, res)
    {
        Community.getCommunity({inv_token: req.body.inv_token}, (ok, msgCommunity) =>
        {
            if(ok)
            {
                if((req.user.id).includes(msgCommunity.creator))
                {
                    let newCommunity =
                    {
                        name : req.body.name,
                        title : req.body.title,
                        description : req.body.description || '',
                        logo: req.body.logo || '',
                        user_admin:req.body.user_admin?(req.body.user_admin).split(","):[],
                        user_moderator: req.body.user_moderator? (req.body.user_moderator).split(",") : [],
                        privacy: req.body.privacy
                    };

                    msgCommunity.update({name: newCommunity.name,
                                        title: newCommunity.title,
                                        description: newCommunity.description,
                                        logo: newCommunity.logo,
                                        user_admin: newCommunity.user_admin,
                                        user_moderator: newCommunity.user_moderator,
                                        privacy: newCommunity.privacy}, (ok, obj) =>
                    {
                        (ok) ? res.status(200).send({ message:"community updated" }) : res.status(500).send({ error: obj });
                    });
                    
                } else res.status(500).send({message: "You need admin of the community to create a group"});
            }
        })
    }

    deleteCommunity(req, res, next)
    {
        Community.getCommunity({inv_token: req.body.inv_token}, (ok, msgCommunity) =>
        {
            if(ok)
            {
                console.log('Nombre: ', msgCommunity.name)
                console.log('Admin: ', msgCommunity.user_admin)

                if((req.user.id).includes(msgCommunity.creator))
                {
                    let name = req.body.name;

                    msgCommunity.remove({name: name}, (ok, obj) =>
                    {
                        if(ok) return res.status(200).send({message:"community deleted"});
                        return res.status(500).send({error:obj});
                    })

                    console.log('eres admi');
                } else res.status(500).send({message: "You need admin of the community to delete a group"});
            }
        });
    }
}

module.exports = CommunityCtrl;
