const User = require("../models/User");
const express = require("express");
const Test = require("../models/Test");
const Auth = require("../MiddleWare/Auth-MiddleWare");
const router = express.Router();
const Question = require("../models/Question");
const Insight = require("../models/Insights");

//Call : Method:GET
//api-call : server-host/user/all
router.get("/all", Auth, async (req, res) => {
  const users = await User.find({});
  res.status(200).send(JSON.stringify(users));
});

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}
router.post("/questions", Auth, async (req, res) => {
  try {
    const { test_id } = req.body;
    const getTest = await Test.findOne({ _id: test_id });
    const { subjectId } = getTest;
    const quiz_Set = await Question.find({ subjectId: subjectId });
    console.log("quiz set", quiz_Set);
    const getEasyQuestions = await Question.find({
      subjectId: subjectId,
      difficulty: "EASY",
    });
    console.log("filtered easy", getEasyQuestions);
    const filteredTwoEasy = await getRandom(getEasyQuestions, 5);

    const getMediumQuestion = await Question.find({
      subjectId: subjectId,
      difficulty: "MEDIUM",
    });

    const filteredTwoMedium = await getRandom(getMediumQuestion, 5);

    const getHardQuestion = await Question.find({
      subjectId: subjectId,
      difficulty: "HARD",
    });

    const filteredTwoHard = await getRandom(getHardQuestion, 5);

    const prepareQuestionSet = [
      ...filteredTwoEasy,
      ...filteredTwoMedium,
      ...filteredTwoHard,
    ];

    const mappedQuestionSet = await prepareQuestionSet.map((question, idx) => {
      const queno = idx;
      const que = question.questionName;
      const options = [
        {
          que_options: question.optionA,
          selected: false,
        },
        {
          que_options: question.optionB,
          selected: false,
        },
        {
          que_options: question.optionC,
          selected: false,
        },
        {
          que_options: question.optionD,
          selected: false,
        },
      ];
      const id = question._id;
      const difficulty = question.difficulty;
      console.log(difficulty);

      return { queno, que, options, id, difficulty };
    });

    console.log("prepared Question Set", mappedQuestionSet);
    res.json({ mappedQuestionSet, getTest,subjectId });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});
router.post("/flip-question", async (req, res) => {
  try {
    console.log("flip-question-testing");
    console.log(req.body);
    const {subjectId} = req.body;
    const { collectedArray } = req.body;
    const {index} = req.body;
    const collectIds = collectedArray.map((item) => item.id);
    const filteredQuestion = await Question.find({
      difficulty: req.body.difficulty,
      subjectId:subjectId,
      _id: { $nin: collectIds },
    });
    console.log("filtered Questions below");
    console.log(filteredQuestion);

    const replaceQuestion = filteredQuestion[0];

    const queno = index;
    const que = replaceQuestion.questionName;
    const options = [
      {
        que_options: replaceQuestion.optionA,
        selected: false,
      },
      {
        que_options: replaceQuestion.optionB,
        selected: false,
      },
      {
        que_options: replaceQuestion.optionC,
        selected: false,
      },
      {
        que_options: replaceQuestion.optionD,
        selected: false,
      },
    ];
    const { id } = replaceQuestion;
    const { difficulty } = replaceQuestion;

    res.json({ data: { queno, que, options, id, difficulty } });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/create",async (req,res)=>{

     try{
       const {prepareTestObject} = req.body;
       const {subjectId} = prepareTestObject;
       const check = await Test.findOne({subjectId:subjectId});
       if(check){
         throw "Test already exists";
       }
       const TestObj = new Test(prepareTestObject);
       const TestCreated = await Test.create(TestObj);
       res.json({msg:"Test has been created",TestCreated});

     }
     catch(e){
      res.status(400).json({ error: e });
     }
})
router.post("/checkresult", async (req, res) => {
  try {
    console.log(req.body);
    //mapping
    const responseSet = req.body.responseSet;
    const currentCoins = req.body.coins;
    let marks = 0;

    console.log("response", responseSet);
    //mapping
    const mappedIds = responseSet.map((item) => item.id);
    const getData = await Question.find({ _id: { $in: mappedIds } });
    console.log("get relevant Questions", getData);

    for (let i = 0; i < responseSet.length; i++) {
      const originalObjectForTheQuestion = getData.filter(
        (item) => item.id == responseSet[i].id
      );
      const { correctAnswer } = originalObjectForTheQuestion[0];
      const checkerAscii = "A";
      if (
        responseSet[i].options[
          correctAnswer.charCodeAt(0) - checkerAscii.charCodeAt(0)
        ].selected
      ) {
        marks++;
      }
    }
    const coins = marks;
    const lifelinesCount = req.body.lifelinesCount;
    const percentage = (marks / 15) * 100;
    console.log("percentage", percentage);
    console.log("marks", marks);
    const prepareTestResponseObj = {
      insight: req.body?.testDetails?.rewards,
      userid: req.session?.user._id,
      testId: req.body.testId,
      score: marks,
      testName: req.body.testDetails.testName,
      coins_earned: percentage,
      lifelinesCount: req.body.lifelinesCount,
    };
    const insightObj = new Insight(prepareTestResponseObj);

    const performOperation = await Insight.create(insightObj);
    console.log(performOperation);

    console.log("==============RESULT ==============");
    console.table(prepareTestResponseObj);

    const coinsUpdated = currentCoins + parseInt(percentage, 10);

    await User.findOneAndUpdate(
      { _id: req.session?.user._id },
      { $set: { coins: coinsUpdated } }
    );
    req.session.user = await User.findOne({_id:req.session?.user._id});

    res.json({ marks, percentage, coins:coinsUpdated, lifelinesCount });
  } catch (e) {
    res.status(400).json({ msg: "failed", error: e });
  }
});

router.post("/fiftyfifty", async (req, res) => {
  try {
    const { question } = req.body;
    let makeCopy = question;
    //mapping for 50 -50 (A-C,B-D)
    const originalQuestion = await Question.findOne({ _id: question.id });
    const { correctAnswer } = originalQuestion;
    //prepare new option set
    console.log(correctAnswer);

    if (correctAnswer === "A" || correctAnswer === "D") {
      makeCopy.options[1].fiftyUsed = true;
      makeCopy.options[2].fiftyUsed = true;
    } else if (correctAnswer === "B" || correctAnswer === "C") {
      makeCopy.options[0].fiftyUsed = true;
      makeCopy.options[3].fiftyUsed = true;
    }

    res.status(200).json({ msg: "success", updated: makeCopy });
  } catch (e) {
    res.status(400).json({ msg: "failed to apply" });
  }
});

/**
 * TEST GET
 */
router.post("/testlist", Auth, async (req, res) => {
  try {
    const userIdExclude = req.session.user._id;
    console.log(req.session.user._id);
    const tests = await Test.find({userId:{$ne:userIdExclude}});
    console.log(tests);
    res.status(200).json({ tests: tests });
  } catch (e) {
    res.status(400).json({ msg: "failed to get tests", error: e });
  }
});

/**
 * check Test Availability
 */
router.post("/checktest", Auth, async (req, res) => {
  try {
    const { testId } = req.body;
    const { _id } = req.session.user;
    const result = await Insight.find({ testId: testId, userId: _id });
    console.log(result, "result");
    if (result.length === 0) {
      res.status(200).json({ attemp: 1, msg: "available to attend" });
    } else {
      res
        .status(200)
        .json({
          attemp: 0,
          msg: "can not attend sorry!! as you have previously attended",
        });
    }
  } catch (e) {
    res.status(400).json({ msg: "failed", error: e });
  }
});

/***
 *
 */
router.post("/get_hint", Auth, async (req, res) => {
  try {
    const { question } = req.body;
    const { id } = question;
    const QuestionInDB = await Question.findOne({ _id: id });

    const { hint } = QuestionInDB;

    console.log("coins", req.session.user.coins);
    const coinupdates = req.session.user.coins - 60;
    const updateUser = await User.findOneAndUpdate(
      { _id: req.session.user._id },
      { coins: coinupdates }
    );
    
    res.status(200).json({ hint: hint, coins: coinupdates, user: updateUser });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

/**
 * EXPERT ADVICE API
 */
router.post("/expertAdvice", async (req, res) => {
  try {
    console.log(req.body);
    const { question } = req.body;
    const originalQuestion = await Question.findOne({ _id: question.id });
    const { correctAnswer } = originalQuestion;
    res.status(200).json({ msg: "success", correctAnswer: correctAnswer });
  } catch (e) {
    res.status(400).json({ msg: "failed to apply" });
  }
});
module.exports = router;
