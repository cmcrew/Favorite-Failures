var http = require('http');
var express = require('express');
var mongoose = require('mongoose');
var schema = mongoose.Schema; 
var requestURL = require('request');
var moment = require('moment');
var ejs = require('ejs'); //embedded javascript template engine
var app = module.exports = express.createServer();
var auth = require('http-auth'); //http authentication module
//------------------------- DATABASE CONFIGURATION -----------------------------//
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Project = mongoose.model('Project');
//------------------------- END DATABASE CONFIGURATION -----------------------------//

//------------------------SERVER CONFIGURATION--------------------//
app.configure(function() {
    
    app.register('html',require('ejs')); //use .html files in /views instead .ejs extension
    app.set('views', __dirname + '/views'); //store all templates inside /views
    app.set('view engine', 'ejs'); // ejs is our template engine
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    
    // define the static directory for css, img and js files
    app.use(express.static(__dirname + '/static'));

    app.use(express.cookieParser());//Cookies must be turned on for Sessions
    app.use(express.bodyParser());
    app.use(express.methodOverride());
  
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
//----------------------------END SERVER CONFIGURATION-------------------------------------------//
//requesting new authentication instance
var basic = auth({
    authRealm : "Private area",
    authList : [process.env.HTPASSWD]
});

// main page - display form
app.get('/', function(request, response) {
    basic.apply(request,response, function(username) {
        //response.send("Welcome to private area");
        
    });
    // render the form
    response.render('FavoriteFailures.html');
});

app.post('/', function(request,response) {
    console.log('posting new project');
    
    var projectData = {
          creativeName : request.body.creativeName
        , creativeEmail : request.body.creativeEmail
        , creativeOffice : request.body.creativeOffice
        , teamMembers : request.body.teamMembers
        , projectName     : request.body.projectName
        , clientName   : request.body.clientName
        , twitterPitch   : request.body.pitch
        , failedBecause      : request.body.failure
    }
    
    console.log('******************************************************');
    console.log('body is ' + request.body);
    console.log(projectData);
    
    // create a new blog post
    var project = new Project(projectData);
    console.log(project);
    
    // save the blog post
    project.save();
    console.log('project ' + project.projectName + ' saved');
    
    response.redirect('/thanks');
});

app.get('/thanks', function(request,response) {
    response.render('thanks.html');
});

// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

// end of main page