const express = require("express"); 
const router = express.Router();    
const passport = require("passport");
const User = require("../models/Users");
require("../controllers/signinGoogle");
var store = require('store')


/* Google */


function isLoggedIn(req, res, next){
     req.user ? next() : res.sendStatus(501);
}



router.get("/googleuserauthentication/signin", passport.authenticate("google",{
     scope: ["email","profile"]
}));


router.get("/authsignin/google/callback",
 passport.authenticate("google", {
      successRedirect:"/eduallgoogleauthentication/signin",
      failureRedirect:"/auth/failure"
}));
 

router.get("/eduallgoogleauthentication/signin", isLoggedIn, async(req, res)=>{  
     let data = await User.find({userid:{$gte:req.user.id}}); 
      if(data.length >= 1){
          store.set('userid', data[0].userid); 
          res.redirect("http://localhost:3000/contacts");
      }else{
        res.status(500).json({message:"You don't  have an Account wet !"});
      }
   });


 
module.exports =  router;
