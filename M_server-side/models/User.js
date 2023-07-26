
const {Schema,model} = require("mongoose");




const UserSchema = new Schema(

  {
     uname:{
       type:String,
       required:true,
     },
     image:{
        type:String,
        required:true,
     },
     email:{
       type:String,
       required:true,
       unique:true
     },
     created_At:{
       type:Number,
       default:Date.now()
     },
     coins:{
       type:Number,
       default:0
     }

  }
);

module.exports = model("users", UserSchema);