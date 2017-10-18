"use strict";

const mongoose = require('./db'),
    communityModel = require('./community'),
    userModel = require('./user');
    
const schema = mongoose.Schema;
const User = new userModel.UserActions();
const Community = new communityModel.CommunityActions();

const groupObject =
{
    community: {type: schema.Types.ObjectId, ref: 'Communities' },
    name : {type:String, required:true, unique:true },
    title : {type: String, required:true},
    description : String, 
    user_moderator: {type: schema.Types.ObjectId, ref: 'Communities.users' },
    users: [{type: schema.Types.ObjectId, ref: 'Communities.users'}],
    creationDate: {type: Date, default: Date.now()}    
};

const groupSchema = new schema(groupObject,{collection : "Communities"});

const group = mongoose.model('Group',groupSchema);

class GroupActions
{  
    registerGroup()
    {
        
    }
}

module.exports = { GroupActions, group };
