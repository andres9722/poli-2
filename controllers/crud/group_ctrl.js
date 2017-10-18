"use strict";

const communityModel = require('../../models/community'),
    groupModel = require('../../models/group');

const Group = new groupModel.GroupActions();
const Community = new communityModel.CommunityActions();

class GroupCtrl
{
    signupGroupCommunity(req,res)
    {
        if(req.body.name || req.body.inv_token)
        {
            if(req.user.id)
            {
                Community.getCommunity({$or:[{inv_token:req.body.inv_token},{name:req.body.name}]},(ok,msgCommunity)=>
                {
                    if(ok)
                    {
                        if((msgCommunity.users).includes(req.user.id))
                        {
                            Group.registerGroup();

                        }else res.status(500).send({message: "You need to be part of the community to create a group"});
                    }else return res.status(400).send(msgCommunity);
                });

            }else return res.status(400).send("Need to authenticate first");
        }else return res.status(400).send("Need community name or invitation token");

    }

}

module.exports = GroupCtrl;
