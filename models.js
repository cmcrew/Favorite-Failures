// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
    
    // User - is an embedded document for Project
    User = new Schema({
      name      : String
    , email      : String
    , office      : String
    });
    
    // Project - 
    var Project = new Schema({
      timestamp : { type: Date, default: Date.now }
    , projectName     : String
    , clientName   : String
    , teamMembers : String
    , twitterPitch   : String
    , failedBecause      : String
    , user  : [User]
    //, uploads : [uploadSchema]
    
    });

    // add schemas to Mongoose
    mongoose.model('Project', Project);
    mongoose.model('User', User);

};