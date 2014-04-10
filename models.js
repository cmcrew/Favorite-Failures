// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
      
    // Project - 
    var Project = new Schema({
        timestamp : { type: Date, default: Date.now }
      , creativeName : {type: String, required: true}
      , creativeEmail : {type: String, required: true}
      , creativeOffice : {type: String, required: true}
      , teamMembers : String
      , creativePhoto : [ImageSchema]
      
      , projectName     : {type: String, required: true}
      , clientName   : {type: String, required: true}
      , twitterPitch   : {type: String, required: true}
      , failedBecause      : String
      //, uploads : [uploadSchema]    
    });
    
    // Profile Image
    var ImageSchema = new Schema({
        filename: String
        , timestamp : { type: Date, default: Date.now }
        
    });
    // add schemas to Mongoose
    mongoose.model('Project', Project);
    mongoose.model('Image', ImageSchema);

};