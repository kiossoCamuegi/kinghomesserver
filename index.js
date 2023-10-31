require("dotenv").config();
const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const Houses = require("./routes/house");
const Auth = require("./routes/auth"); 
const bodyParser = require("body-parser");  
const session = require("express-session");
const passport = require("passport");

mongoose.connect(process.env.DATABASE_URL ,{useNewUrlParser:true})
const DB = mongoose.connection;


try {
    DB.on("error", (error)=>console.error(error));
   DB.once("open", ()=>console.log("Connected to Database"));
} catch (error) {
   console.log(error); 
}
  


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://kinghomes.vercel.app')
   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.json());
app.use(session({secret:"kinghomesession", cookie: { maxAge:24 * 60 * 60 * 1000}})) 
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/images', express.static(__dirname+'/images'));
app.use(Houses);
app.use(Auth); 

 
app.listen(5000, ()=>{
    console.log("KIOSSO server IS Running");
})