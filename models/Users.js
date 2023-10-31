const moongose = require("mongoose");


const UserSchema  =  new moongose.Schema({
     name:{
        type:String,
        required:true,
     },
     email:{
        type:String,
        required:true,
     },
     userid:{
        type:String,
        required:true,
     },
     image:{
        type:String,
        required:false,
     },
    registerDate:{
        type:Date,
        required:true,        
       default:Date.now
    }
})
module.exports = moongose.model("users", UserSchema);