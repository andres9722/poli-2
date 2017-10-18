"use strict";

const app = require('./app');
const server = app.listen(app.get('port'), startServer);

function startServer(err) {
    if(err) return;
    console.log(`Starting API at port: ${app.get('port')}`);
}
