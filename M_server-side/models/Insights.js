
const {Schema,model} = require("mongoose");




const insightSchema = new Schema(

  {
     insight:{
       type:String,
       required:true,
     },
     userid:{
        type:String,
        required:true,
     },
     testId:{
        type:String,
        required:true,
     },
     score:{
        type:Number,
        required:true,
     },
     testName:{
        type:String,
        required:true,
     },
     coins_earned:{
      type:Number,
      required:true,
     },
     lifelinesCount:{
        type:Array,
        required:true
     },
     created_At:{
       type:Number,
       default:Date.now()
     }

  }
);

module.exports = model("insights", insightSchema);