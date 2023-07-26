
const {Schema,model} = require("mongoose");




const subjectSchema = new Schema(

  {
     subject:{
       type:String,
       required:true,
     },
     userid:{
        type:String,
        required:true,
     },
     created_At:{
       type:Number,
       default:Date.now()
     }

  }
);

module.exports = model("subjects", subjectSchema);