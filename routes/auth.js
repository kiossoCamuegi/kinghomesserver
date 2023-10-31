const express = require("express"); 
const router = express.Router();    
const passport = require("passport");
const User = require("../models/Users");
require("../controllers/authgoogle");
var store = require('store')

const URL  =  "https://kinghomes.vercel.app/"

/* Google */


function isLoggedIn(req, res, next){
     req.user ? next() : res.sendStatus(501);
}


router.get("/googleuserauthentication/signup", 
passport.authenticate("google",{
     scope: ["email","profile"]
}));
 

router.get("/auth/google/callback",
 passport.authenticate("google", {
      successRedirect:"/eduallgoogleauthentication/signup",
      failureRedirect:"/auth/failure"
}));


router.get("/checkuserstatus",  async(req, res)=>{ 
    let id = store.get('userid');
    let data = await User.find({userid:{$gte:id}});  
    res.json(data.length >= 1 ? data[0] : null);
});


router.get("/eduallgoogleauthentication/signup", isLoggedIn, async(req, res)=>{  

  let data = await User.find({userid:{$gte:req.user.id}}); 
   if(data.length <= 0){
     const Data = new User({ 
          name:req.user.displayName,
          email:req.user.emails[0].value,
          image:req.user.photos[0].value, 
          userid:req.user.id
          });
     
     try {
        const newData = await Data.save();   
        store.set('userid', newData.userid); 
        res.redirect(URL+"dashboard");
     } catch (error){ 
        res.status(500).json({message:error.message});
     } 
   }else{ 
     store.set('userid', data[0].userid); 
     res.redirect(URL+"dashboard");
   }
});

 
 
router.get("/auth/failure", (req, res)=>{
     res.status(500).json({message:"Something went wrong !"});
});
  
router.get("/auth/logout", (req, res)=>{ 
     req.session.destroy();
     store.clearAll()
     res.redirect(URL+"signin");
});
 

 
module.exports =  router;
