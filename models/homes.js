const mongoose =  require("mongoose");

const HomesSchema =  new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    youtube:{
        type:String,
        required:true
    }, 
    location:{
        type:String,
        required:true
    }, 
    type:{
        type:String,
        required:true
    }, 
    usercode:{
        type:String,
        required:true
    },  
    visitors:{
        type:Number,
        required:false
    },
    registerDate:{
        type:Date,
       required:true,
       default:Date.now
    },

});


module.exports  = mongoose.model("Homes", HomesSchema);