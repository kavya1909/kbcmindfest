
const {Schema,model} = require("mongoose");




const questionSchema = new Schema(

  {
     questionName:{
       type:String,
       required:true,
     },
     optionA:{
        type:String,
        required:true,
     },
     optionB:{
        type:String,
        required:true,
     },
     optionC:{
        type:String,
        required:true,
     },
     optionD:{
        type:String,
        required:true,
     },
     hint:{
         type:String,
        
     },
     correctAnswer:{
         type:String,
         required:true
     },
     difficulty:{
        type:String,
        required:true
     },
     subjectId:{
         
        type:String,
        required:true
     },
     created_At:{
       type:Number,
       default:Date.now()
     }

  }
);

module.exports = model("questions", questionSchema);