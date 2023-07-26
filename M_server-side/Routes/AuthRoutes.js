const express = require("express");
const {OAuth2Client} = require("google-auth-library");
const Auth = require("../MiddleWare/Auth-MiddleWare");
const User = require("../models/User");
const client = new OAuth2Client(process.env.CLIENT_ID)

// import { IUser } from '../Interfaces/user';



const router = express.Router();



// app.use(async (req:express.Request, res:express.Response, next:express.NextFunction) => {
//   try{
//     const user = await User.findOne({id:req.session.id});

//     req.user =  {email:user?.email ,uname:user?.uname};


//     next()
//   }
//   catch(e){
//     res.status(400).json({msg:"failed"});
//   }
// })
//get me 
router.get("/me", Auth, function (req, res) {
  
  console.log("Hi");

  res.status(200);
  res.json({ msg: "success", user: req.user,isAuthenticated:true });
})

//logout
router.delete("/api/v1/logout", async function (req, res) {
  // console.log("In logout",req.cookies);
  try{
    req.session.destroy(() => {
      res.status(201);
      res.json({
        message: "Logged out successfully",isAuthenticated:false
      });
    });
  }
  catch(e){
    res.json({message:"couldn't log out",isAuthenticated:true});
  }
 
})

//login
router.post('/api/google', async (req, res) => {
  try {
    const { credential } = req.body

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID
    })
    const obj = ticket.getPayload();
    const newUser = new User({
      uname: obj.name,
      email: obj.email,
      image:obj.picture
    });
  
    const foundUser = await User.findOne({ email: obj.email });
    if (!foundUser) {
      const user = await User.create(newUser);
      req.session.user = user;
      console.log("host",req.get("host"));
      console.log("path",req.path);
  
      const origin = req.get('origin');
   
      res.redirect(301, origin);
    } else {
       console.log(obj.picture);
       await User.findOneAndUpdate({email:obj.email},{$set:{image:obj.picture}});
      const findUser = await User.findOne({email:obj.email});
      console.log("updates",findUser);
      req.session.user = findUser;
      const origin = req.get('origin');
    
      res.redirect(301,origin);
    }
  } catch (e) {
    res.status(400);
    if (e instanceof Error) {
      res.json({ msg: "failed to auth the user", error: e.message });
    }
  }
})

module.exports = router;