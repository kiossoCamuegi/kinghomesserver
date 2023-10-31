const express = require("express");
const router = express.Router();
const Homes = require("../models/homes");
const  multer = require(`multer`);
const  path = require(`path`); 
const Files = require("../models/Files"); 
const User = require("../models/Users"); 
var store = require('store')

const stream = require("stream");   
const { google } = require("googleapis");
const app = express();
const upload = multer();



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

 
const KEYFILEPATH = path.join(__dirname, "uploaddrive.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});


 
router.post("/upload" ,  upload.any(),  async(req, res)=>{   
 
   let id = store.get('userid'); 
   if(id !== undefined){


 

   const uploadFile = async(fileObject) => {
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileObject.buffer);
      try {
         const { data } = await google.drive({ version: "v3", auth }).files.create({
            media: {
                mimeType: fileObject.mimeType,
                body: bufferStream,
            },
            requestBody: {
                name: fileObject.originalname,
                parents: ["1UBIcXC13aSlxZZ6Me_5JSVtpS5hGzYdz"],
            },
            fields: "id,name",
         }); 


        console.log(data.id)
        let  Data = new Files({name:data.id, code:req.body.code})
        const newData = await Data.save();
        res.status(201).json(newData); 

      } catch (error) {
         res.status(500).json({message:error.message});
      }
   };
   
  const {files } = req;
  for (let f = 0; f < files.length; f += 1) {
     try {
         await uploadFile(files[f]); 
     } catch (error) { 
      res.status(500).json({message:error.message});
     }
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