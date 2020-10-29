var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var logger = require('morgan');
var mongoose = require('mongoose');
var models = require('./models');
var routes = require('./routes');
var config = require('config');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var async = require('async');

var app = express();
app.set('port', config.server.port);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//This is to allow to get req from the same server as us
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// We are going to protect /api routes with JWT
var expressJwt = require('express-jwt');
var someSecret = "someSecret";
 app.use('/api', expressJwt({
     secret: someSecret
 }));


var dbUrl = config.mongoDb.uri;
var connection = mongoose.createConnection(dbUrl);
connection.on('error', console.error.bind(console,
    'connection error:'));
connection.once('open', function () {
    console.info('>>>>>>>>>> Connected to database')
});

function db(req, res, next) {
    req.db = {
        User: connection.model('User', models.User, 'users'),
        Assessment: connection.model('Assessment', models.Assessment, 'assessments')
    };
    return next();
}

var ensureAuthenticated = routes.main.ensureAuthenticated;

//MAIN
app.post('/apii/login', db, routes.main.login);
app.post('/apii/logout', routes.main.logout);
app.post('/apii/forgot', db, routes.main.forgot);
app.get('/apii/reset/:token', db, routes.main.getReset);
app.post('/apii/reset/:token', db, routes.main.setReset);

//Users
app.get('/api/users', db, routes.users.getUsers);
app.get('/api/users/:userId', db, routes.users.getUser);
app.post('/apii/users/', db, routes.users.addUser);
app.put('/api/users/:userId', db, routes.users.updateUser);
app.delete('/api/users/:userId', db, routes.users.deleteUser);

//Assessment
app.get('/api/assessments', db, routes.assessments.getAssessments);
app.get('/api/assessments/user', ensureAuthenticated, db, routes.assessments.getUserAssessments)
app.get('/api/assessments/:assessmentId',ensureAuthenticated, db, routes.assessments.getAssessment);
app.post('/api/assessments/', db, routes.assessments.addAssessment);
app.put('/api/assessments/:assessmentId', db, routes.assessments.updateAssessment);
app.delete('/api/assessments/:assessmentId', ensureAuthenticated, db, routes.assessments.deleteAssessment);
app.get('/api/assessment/example/', routes.assessments.getExampleAssessment);

function logErrors(err, req, res, next) {
    if (typeof err === 'string')
        err = new Error(err);
    console.error('logErrors', err.toString());
    next(err);
}
app.use(logErrors);

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        console.error('clientErrors response');
        res.status(500).json({
            error: err.toString()
        });
    } else {
        next(err);
    }
}
app.use(clientErrorHandler);


function errorHandler(err, req, res, next) {
    console.error('lastErrors response');
    res.status(500).send(err.toString());
}
app.use(errorHandler);

app.listen(process.env.PORT || app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;