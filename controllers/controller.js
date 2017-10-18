"use strict";

const controllers =
{
    UserCtrl: require('./crud/user_ctrl'),
    GroupCtrl: require('./crud/group_ctrl'),
    CommunityCtrl:  require('./crud/community_ctrl'),
    ApiCtrl: require('./api/api_ctrl')
};

module.exports = controllers;
