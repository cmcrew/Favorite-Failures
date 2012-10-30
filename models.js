// export Schemas to web.js
module.exports.configureSchema = function(Schema, mongoose) {
      
    // Project - 
    var Project = new Schema({
        timestamp : { type: Date, default: Date.now }
      , creativeName : {type: String, required: true}
      , creativeEmail : {type: String, required: true}
      , creativeOffice : {type: String, required: true}
      , teamMembers : String
      
      , projectName     : {type: String, required: true}
      , clientName   : {type: String, required: true}
      , twitterPitch   : {type: String, required: true}
      , failedBecause      : String
      //, uploads : [uploadSchema]
    
    });

    // add schemas to Mongoose
    mongoose.model('Project', Project);

};