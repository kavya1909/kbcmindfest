const express = require("express")
const app= express();

const Auth = async (req, res, next ) => {

  try {
    if (typeof req.session.user !== "undefined" || req.session.user === true) {
      req.user = req.session.user;
    }
    else{
      throw "Authentication failed";
    }
    next();
  }
  catch (e) {
    res.status(400).json({ msg: "Authentication failed2",error:e });
  }
}
module.exports = Auth;