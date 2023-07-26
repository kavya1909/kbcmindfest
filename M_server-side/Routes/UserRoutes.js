const express = require("express");
const User = require("../models/User");
const Auth= require("../MiddleWare/Auth-MiddleWare")
const router = express.Router();
router.get('/displayinfo',Auth, async (req,res)=>{

   

  const userIdExclude = req.session.user._id;
          console.log(req.session.user._id);
          const userinfo =  await User.find({_id:userIdExclude});
          console.log(userinfo);
          res.status(200).send(JSON.stringify(userinfo));

})

module.exports =  router;