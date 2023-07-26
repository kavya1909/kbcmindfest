const express = require("express");
const Auth = require("../MiddleWare/Auth-MiddleWare");
const Question = require("../models/Question");
const Subject = require("../models/Subject");
const Test = require("../models/Test");
const router = express.Router();

//Call : Method:GET
//api-call : server-host/user/all
router.post('/addsubject', Auth, async (req, res) => {


     console.log(req.body);
    console.log(req.user);
    try{
      const sub = new Subject({
          subject:req?.body?.subject?.Title,
          userid:req.user._id
      })
      await Subject.create(sub);

     const allSubjects = await Subject.find({userid:req.user._id});

    res.status(200).json({msg:"successfully added subject",subjects:allSubjects});

    }
    catch(e){
        console.log(e);
        res.status(400).json({msg:"something went wrong with server",error:e});
    }

})

router.get("/all",Auth,async (req,res)=>{

    const subjects = await Subject.find({userid:req?.user?._id});
    res.status(200).send(JSON.stringify(subjects));

})

router.post("/addquestion",async (req,res)=>{

    console.log(req.body);
     
    const question= new Question({
        questionName:req.body.questionName,
        optionA:req.body.optionA,
        optionB:req.body.optionB,
        optionC:req.body.optionC,
        optionD:req.body.optionD,
        correctAnswer:req.body.correctAnswer,
        hint:req.body.hint,
        difficulty:req.body.difficultyLevel,
        subjectId:req.body.subjectId



    })
        await Question.create(question);

     
    res.json({msg:"received request for adding new question"});


})

router.post("/TestCreateCheck",async (req,res)=>{

    //generate Test Id HERE
    try{
        const {subjectId}  = req.body;
        const  QuestionsFromDbForSubject = await Question.find({subjectId:subjectId});
        console.log(QuestionsFromDbForSubject);
        const TestFind = await Test.findOne({subjectId:subjectId});
        if(TestFind) throw  "Test already exists";
        res.json({QuestionLength:QuestionsFromDbForSubject.length});

    }catch(e){
        res.status(400).json({msg:e});
        console.log(e);
    }
})
module.exports = router;