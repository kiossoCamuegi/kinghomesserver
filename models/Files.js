const mongoose =  require("mongoose");

const FilesSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:true
    }, 
    code:{
        type:String,
        required:true
    }, 
    registerDate:{
        type:Date,
       required:true,
       default:Date.now
    },

});


module.exports  = mongoose.model("Files", FilesSchema);