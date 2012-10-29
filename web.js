var express = require('express');
var mongoose = require('mongoose');
var schema = mongoose.Schema; 
var requestURL = require('request');
var moment = require('moment');
var ejs = require('ejs'); //embedded javascript template engine
var app = express();

//------------------------- DATABASE CONFIGURATION -----------------------------//
app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Project = mongoose.model('Project');
var User = mongoose.model('User');
//------------------------- END DATABASE CONFIGURATION -----------------------------//

//------------------------SERVER CONFIGURATION--------------------//
app.configure(function() {
    
    app.engine('.html', require('ejs').__express);  //use .html files instead of .ejs
    app.set('views', __dirname + '/views'); //store all templates inside /views
    app.set('view engine', 'ejs'); // ejs is our template engine
    app.set('view options',{layout:true}); // use /views/layout.html to manage your main header/footer wrapping template
    
    app.use(express.cookieParser());//Cookies must be turned on for Sessions
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    
    // define the static directory for css, img and js files
    app.use(express.static(__dirname + '/static'));
  
    /**** Turn on some debugging tools ****/
    app.use(express.logger());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
//----------------------------END SERVER CONFIGURATION-------------------------------------------//


// main page - display form
app.get('/', function(request, response) {
    
    // render the form
    response.render('FavoriteFailures.html');
          
});

app.post('/', function(request,response) {
    console.log('posting new project');
    
    var userData = {
        name : request.body.creativeName
        , email : request.body.creativeEmail
        , office : request.body. creativeOffice        
    }
    
    var projectData = {
         projectName     : request.body.projectName
        , clientName   : request.body.client
        , teamMembers : request.body.teamMembers
        , twitterPitch   : request.body.pitch
        //, failedBecause      : request.body.??
        //, user  : [User]
    }
    
    // create a new blog post
    var project = new Project(projectData);
    
    // save the blog post
    project.save();
    console.log('project ' + project.projectName + 'saved');
    
    response.redirect('thanks.html');
}); 

// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

// end of main page