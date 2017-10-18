"use strict";
const base = require('./base'),
    auth = require('../middlewares/auth');
    
/*CONTROLLERS DEFS*/
const ctrl = require('../controllers/controller');

/*OBJS*/
const user = new ctrl.UserCtrl();
const community = new ctrl.CommunityCtrl();
const group = new ctrl.GroupCtrl();
const api = new ctrl.ApiCtrl();


/*ROUTES*/
base.post('/newUser', user.signupUser);
base.post('/newCommunity', auth, community.signupCommunity);
base.post('/newUserCommunity', user.signupUserCommunity);
base.post('/newGroupCommunity', auth, group.signupGroupCommunity);

base.post('/updateCommunity', auth, community.updateCommunity);
base.post('/deleteCommunity', auth, community.deleteCommunity);

base.post('/updateUser', auth, user.updateUser);
base.post('/deleteUser', auth, user.deleteUser);

base.post('/login',user.loginUser);

module.exports = base;
