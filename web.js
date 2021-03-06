var express = require('express');
var mongoose = require('mongoose');
var schema = mongoose.Schema; 
var requestURL = require('request');
//var format = require('util').format;
var ejs = require('ejs'); //embedded javascript template engine
var app = module.exports = express.createServer();
var auth = require('http-auth'); //http authentication module
var fs = require('fs');

// YOUR BUCKET NAME
var myBucket = 'favorite_failure';

var knox = require('knox');

var S3Client = knox.createClient({
      key: process.env.AWS_KEY
    , secret: process.env.AWS_SECRET
    , bucket: myBucket
});
//------------------------- DATABASE CONFIGURATION -----------------------------//

//app.db = mongoose.connect(process.env.MONGOLAB_URI); //connect to the mongolabs database - local server uses .env file

// Include models.js - this file includes the database schema and defines the models used
require('./models').configureSchema(schema, mongoose);

// Define your DB Model variables
var Project = mongoose.model('Project');
var Image = mongoose.model('Image');
//------------------------- END DATABASE CONFIGURATION -----------------------------//

//------------------------SERVER CONFIGURATION--------------------//
app.configure(function() {
    
    app.register('html',require('ejs')); //use .html files in /views instead .ejs extension
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
//requesting new authentication instance
var basic = auth({
    authRealm : "Private area",
    authList : [process.env.HTPASSWD]
});

// main page - display form
app.get('/', function(request, response) {
    basic.apply(request,response, function(username) {
        
    });
    // render the form
    response.render('FavoriteFailures.html');
});

app.post('/', function(request,response) {
    console.log('posting new project');
    console.log('FILES!!!!!!!!!!!!!!!!!!!!!!');
    console.log(request.files);
    
    // 1) Get file information from submitted form
        filenameProfileImage = request.files.image.filename; // actual filename of file
        pathProfileImage = request.files.image.path; //will be put into a temp directory
        typeProfileImage = request.files.image.type; // image/jpeg or actual mime type
        
    //Information for submitted materials
<<<<<<< HEAD
    supportingdocs = request.files.supportingfiles;
    console.log('Supporting Docs!!!!!!!!!!!!!!!!!!!!!!');
    console.log(supportingdocs);
    console.log('Supporting Docs Ending!!!!!!!!!!');
    var cleanedFileNameDocs = [];
    var filenameDocs = [];
    var pathDocs = [];
    var typeDocs = [];
    
    //for loop that goes through supporting docs and creates filename, path, and type.
    for(var i = 0; i < supportingdocs.length; i++) {
      filenameDocs.push(request.files.supportingfiles[i].filename);
      pathDocs.push(request.files.supportingfiles[i].path);
      typeDocs.push(request.files.supportingfiles[i].type);
    }
      console.log('*******************supportingdocs file info***********************');
      console.log(filenameDocs);
                
    // 2) create file name with logged in user id + cleaned up existing file name. function defined below.
        cleanedFileNamePI = cleanFileName(filenameProfileImage);
        for(var j = 0; j < filenameDocs.length; j++) {
            cleanedFileNameDocs.push(cleanFileName(filenameDocs[j]));
        }
       // cleanedFileNameDocs = cleanFileName(filenameDocs);
        console.log('*******************cleaned file names***********************');
        console.log(cleanedFileNamePI);
        console.log(cleanedFileNameDocs);
=======
    //supportingdocs = request.files.supportingfiles;
    //for loop that goes through supporting docs and creates filename, path, and type.
      /*  filenameDocs = request.files.supportingfiles.filename;
        pathDocs = request.files.supportingfiles.path;
        typeDocs = request.files.supportingfiles.type;*/
                
    // 2) create file name with logged in user id + cleaned up existing file name. function defined below.
        cleanedFileNamePI = cleanFileName(filenameProfileImage);
       // cleanedFileNameDocs = cleanFileName(filenameDocs);
        console.log('*******************cleaned file name***********************');
        console.log(cleanedFileNamePI);
       // console.log(cleanedFileNameDocs);
>>>>>>> 3b801459cd9d5b9102daabba909911af4242cf7d
       
    // 3a) We first need to open and read the file
        fs.readFile(pathProfileImage, function(err, buf){
            
            // 3b) prepare PUT to Amazon S3
            var req = S3Client.put(cleanedFileNamePI, {
              'Content-Length': buf.length
            , 'Content-Type': typeProfileImage
            });
            // for debugging purposes
            console.log(req);
            
            // 3c) prepare 'response' callback from S3
            req.on('response', function(res){                
                if (200 == res.statusCode) {
                    console.log('Inside 200 == res.statusCode');
                    // create new Image
                    var newImage = {
                        filename : cleanedFileNamePI
                    };
                    console.log('new image');
                    console.log(newImage);
                    
<<<<<<< HEAD
                    //create new upload file array?
                    var uploadFiles = {
                        filename: cleanedFileNameDocs
                    };
                    console.log('new file');
                    console.log(uploadFiles);
                    
=======
>>>>>>> 3b801459cd9d5b9102daabba909911af4242cf7d
                     //Create Project Object
                    var projectData = {
                            creativeName : request.body.creativeName
                          , creativeEmail : request.body.creativeEmail
                          , creativeOffice : request.body.creativeOffice
                          , teamMembers : request.body.teamMembers
                          , projectName     : request.body.projectName
                          , clientName   : request.body.clientName
                          , twitterPitch   : request.body.pitch
                          , failedBecause      : request.body.failure
                          , creativePhoto : [newImage]
<<<<<<< HEAD
                          , uploads : [uploadFiles.filename]
=======
>>>>>>> 3b801459cd9d5b9102daabba909911af4242cf7d
                    };
                    
                    console.log('****************** Project Data ************************************');
                    console.log(projectData);
                    
                    // create a new blog post
                    var project = new Project(projectData);
                    console.log('****************** Project ************************************');
                    console.log(project);
                    
                    // save the blog post
                    project.save();
                    console.log('project ' + project.projectName + ' saved');
                    
                    response.redirect('/thanks');
                
                }
                else {
                
                    response.send("an error occurred. unable to upload profile photo");
                    console.log(err);
                
                }
            });
        
            // 3d) finally send the content of the file and end
            req.end(buf);
        });
     
});

app.get('/thanks', function(request,response) {
    response.render('thanks.html');
});

var cleanFileName = function(filename) {
    
    // cleans and generates new filename for example userID=abc123 and filename="My Pet Dog.jpg"
    // will return "abc123_my_pet_dog.jpg"
    fileParts = filename.split(".");
    
    //get the file extension
    fileExtension = fileParts[fileParts.length-1]; //get last part of file
    
    //add time string to make filename a little more random
    d = new Date();
    timeStr = d.getTime();
    
    //name without extension "My Pet Dog"
    newFileName = fileParts[0];
    
    return newFilename = timeStr + "_" + fileParts[0].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') + "." + fileExtension;
    
}

// Make server turn on and listen at defined PORT (or port 3000 if is not defined)
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on ' + port);
});

// end of main page