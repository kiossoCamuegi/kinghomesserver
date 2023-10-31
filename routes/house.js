const express = require("express");
const router = express.Router();
const Homes = require("../models/homes");
const  multer = require(`multer`);
const  path = require(`path`); 
const Files = require("../models/Files"); 
const User = require("../models/Users"); 
var store = require('store')


const storage = multer.diskStorage({
    destination:path.join(__dirname, `./../images/`),
    filename:(req, file,  cb)=>{
       return cb(null, `kinghomes_file_${file.fieldname}_${Date.now()}_${Math.random(1,38939839399310001209655555555555556590569659650650965906509656590569002)}_${Math.random(1,38939839399310001209655555555555556590569659650650965906509656590569002)}_${path.extname(file.originalname)}`)
    }
});

 const uploadStudentPicture = multer({
    storage:storage
}).single(`image`);




//geting houses
router.get("/", async(req, res)=>{
   res.send("Hello to kiosso api !");
});


//geting houses
router.get("/homes", async(req, res)=>{
    const Rows  = [];
   try {
      const Data =  await Homes.find(); 
      for (let i = 0; i < Data.length; i++){
           let data = await Files.find({code:Data[i].code})
           Rows.push({content:Data[i], files:data})
      }
      res.json(Rows);
   } catch (error) {
       res.status(500).json({message:error.message});
   }
});

///geting single house
router.get("/homesget/:id", GetHome, async(req, res)=>{ 
     let data = await Files.find({code:res.home.code}); 
     if(data.length <= 0) data = [];
     res.json({content:res.home, files:data})
});


router.get("/userhomes", async(req, res)=>{
   let id = store.get('userid'); 
   if(id !== undefined){ 
      let rows = await Homes.find({usercode:id});  
      res.status(201).json(rows);
    }else{
      res.status(201).json([]);
    } 
});


//Creating Home
router.post("/posthome", async(req, res)=>{ 
     const {title, price, location, type, youtube,   code, description} =  req.body; 
      let id = store.get('userid'); 
    if(id !== undefined){ 
      const Data = new Homes({ 
         title:title,
         price:price,
         location:location,
         type:type,
         youtube:youtube, 
         description:description,
         code:code,
         usercode:id,
         visitors:0
      });
 
      try {
         const newData = await Data.save();
         res.status(201).json(newData);
      } catch (error){
       console.log(error)
         res.status(500).json({message:error.message});
      }
    }else{
      res.status(500).json({message:"Something went wrong !"});
    } 
});

 

router.post("/upload" ,  uploadStudentPicture,  async(req, res)=>{   
   const Data = new Files({ 
      name:req.file.filename,
      code:req.body.code, 
  });

    let id = store.get('userid'); 
    if(id !== undefined){

      try {
         const newData = await Data.save();
         res.status(201).json(newData);
      } catch (error){
       console.log(error)
         res.status(500).json({message:error.message});
      } 
    }else{
      res.status(500).json({message:"Something went wrong !"});
    }
});


//Updating Home
router.patch("/updatehome/:id", GetHome, async(req, res)=>{ 
    const {title, price, description, youtube, type} =  req.body;

    let id = store.get('userid'); 
    if(id !== undefined){

      res.home.title = title;
      res.home.price = price;
      res.home.description = description;
      res.home.youtube = youtube;
      res.home.type = type;
   
      try {
         const updateData = await res.home.save();
         res.status(201).json(updateData);
      } catch (error){
         res.status(500).json({message:error.message});
      }
    }else{
      res.status(500).json({message:"Something went wrong !"});
    }
});


//Updating Home
router.patch("/updatehomevisitors/:id", GetHome, async(req, res)=>{  
   res.home.visitors = ((res.home.visitors*1)+1); 

   try {
      const updateData = await res.home.save();
      res.status(201).json(updateData);
   } catch (error){
      res.status(500).json({message:error.message});
   }


});

//Delete home
router.delete("/delete/:id", GetHome,  async(req, res)=>{
   let id = store.get('userid'); 
   if(id !== undefined){
      try {
         await res.home.deleteOne();
         res.json({message:"Home deleted  !"});
    } catch (error) {
       res.status(500).json({message:error.message});
    }
   }else{
      res.status(500).json({message:"Something went wrong !"});
   }
});

//Delete home
router.delete("/deleteimage/:id", GetFile,  async(req, res)=>{
   let id = store.get('userid'); 
   if(id !== undefined){ 
      try {
         await res.image.deleteOne();
         res.json({message:"image deleted  !"});
    } catch (error) {
       res.status(500).json({message:error.message});
    }
   }else{
      res.status(500).json({message:"Something went wrong !"});
   }
});



async function GetHome(req, res, next) {
   let home;
   try {
      home = await Homes.findById(req.params.id);
      if(home == null){
         return res.status(404).json({message:"Cannot find home"});
      }
   } catch (error) {
      res.status(500).json({message:error.message});
   }

   res.home = home;
   next();
}




async function GetFile(req, res, next) {
   let image;
   try {
      image = await Files.findById(req.params.id);
      if(image == null){
         return res.status(404).json({message:"Cannot find home"});
      }
   } catch (error) {
      res.status(500).json({message:error.message});
   }

   res.image = image;
   next();
}

module.exports = router;