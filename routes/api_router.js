"use strict";
const base = require('./base');

/*CONTROLLERS DEFS*/
const apiController = require('../controllers/controller').ApiCtrl;

/*OBJS*/
const api = new apiController();

/*ROUTES*/
//http://localhost:3001/getUser?id=30&email=llll
 base.get('/API/getUser/by/:nick?:email?:id?', api.getUser);
 base.get('/API/getUsers', api.getUsers);

module.exports = base;
