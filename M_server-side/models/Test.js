
const {Schema,model} = require("mongoose");




const testSchema = new Schema(

  {
     testName:{
       type:String,
       required:true,
     },
     testDescription:{
      type:String,
      required:true
     },
    testPoweredBy:{

        type:String,
        required:true,

     },
     subjectId:{
        type:String,
        required:true,
     },
     rewards:{
        type:String,
        required:true
     },
     
     userId:{
         type:String,
         required:true
     },
     created_At:{
       type:Number,
       default:Date.now()
     }

  }
);

module.exports = model("tests", testSchema );