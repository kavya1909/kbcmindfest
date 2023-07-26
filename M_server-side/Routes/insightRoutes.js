

const express = require("express");

const router = express.Router();
const Insight = require("../models/Insights");
//.........
//Call : Method:GET
//api-call : server-host/user/all
router.post("/get-all-insights",async (req,res)=>{

     try{
       const getAllInsights = await Insight.find({userid:req?.session?.user?._id});
       res.status(200).json({insights:getAllInsights,msg:"success"});
         

     }catch(e){
       res.status(400).json({msg:"failed",error:e});
     }

})

module.exports =  router;