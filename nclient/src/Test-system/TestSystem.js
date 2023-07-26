import { useContext, useEffect, useState } from "react";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Header from "../components/Header";
import { useTimer } from "react-timer-hook";
import "./style.css";
import API from "../api/util";
import { AuthContext, reducer } from "../App";
import { Box, LinearProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useParams } from "react-router-dom";
import { ForkRight } from "@mui/icons-material";

const Quiz = () => {


    
  const { test_id } = useParams();

  const expiryTimestamp = new Date();
  //   const { state } = useContext(AuthContext);
  const { state, dispatch } = useContext(AuthContext);

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 60);

  const [lifelinesCount, setLifeLinesCount] = useState([]);
  //  var testDetails = null;

  const check5050 =
    lifelinesCount.filter((item) => item.key == "50-50").length >= 1
      ? true
      : false;
  const checkFlip =
    lifelinesCount.filter((item) => item.key == "flip").length >= 1
      ? true
      : false;
  const checkdoubleDip =
    lifelinesCount.filter((item) => item.key == "double-dip").length >= 1
      ? true
      : false;
  const checkExpertAdvice =
    lifelinesCount.filter((item) => item.key == "expert-advice").length >= 1
      ? true
      : false;

  const [loading, setLoading] = useState(false);
  const [stateObj, setstateObj] = useState({
    activeStep: 0,
    Quiz_Set: [],
    booleanonsubmit: false,
    Total: 0,
    open: false,
    catchmsg: "",
    errormsg: "",
    testDetails: {},
    hint_text: "",
    subjectId:""
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      API.post("/test/questions", { test_id: test_id }).then((res) => {
        console.log(res, "from server for test");
        console.log(res.data, "server test Obj");

        setstateObj({
          ...stateObj,
          Quiz_Set: res.data.mappedQuestionSet,
          testDetails: res.data.getTest,
          subjectId:res.data.subjectId
        });
      });
    };
    fetchQuestions();
  }, [test_id]);

  //Timer -Hook
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,

    onExpire: () => console.warn("onExpire called"),
  });

  useEffect(() => {
    if (minutes === 0 && seconds === 0 && stateObj.activeStep!=14) {
      handleNext();
    }
  }, [minutes, seconds]);

  /**
   * It allows to skip or move to the next Question
   */
  const handleNext = async () => {
    await restart(new Date().setSeconds(new Date().getSeconds() + 60));
    await start();
    setstateObj({ ...stateObj, activeStep: stateObj.activeStep + 1 });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setstateObj({ ...stateObj, open: false });
  };

  const Lifelineuse5050 = () => {
    const checkLifeline = lifelinesCount.filter((item) => item.key == "50-50");
    if (lifelinesCount.length === 4) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: "You have used all lifelines",
        open: true,
      });
    } else if (checkLifeline.length > 0) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: `50-50 is already used before choose another`,
        open: true,
      });
    } else {
      pause();
      setLoading(true);
      console.log(stateObj.activeStep);
      const question = stateObj.Quiz_Set[stateObj.activeStep];
      API.post("/test/fiftyfifty", { question }).then((res) => {
        console.log(res, "50-50");
        if (res.status === 200) {
          const newMap = stateObj.Quiz_Set.map((question, idx) => {
            if (idx === stateObj.activeStep) {
              return res.data.updated;
            }
            return question;
          });
          setstateObj({
            ...stateObj,
            Quiz_Set: newMap,
            errormsg: "success",
            open: true,
            catchmsg: `50-50 is being used`,
          });
          setLifeLinesCount([...lifelinesCount, { key: "50-50" }]);
          start();
          console.log(newMap);
        }
      });

      console.log("fiftyfifty");
    }
  };
  const expertAdvice = async () => {
    const checkLifeline = lifelinesCount.filter(
      (item) => item.key == "expert-advice"
    );
    if (lifelinesCount.length === 4) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: "You have used all lifelines",
        open: true,
      });
    } else if (checkLifeline.length > 0) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: `expert-advice is already used before choose another`,
        open: true,
      });
    } else {
      pause();
      setLoading(true);
      console.log(stateObj.activeStep);
      const question = stateObj.Quiz_Set[stateObj.activeStep];
      API.post("/test/expertAdvice", { question }).then((res) => {
        console.log(res, "expert-advice");
        if (res.status === 200) {
          setstateObj({
            ...stateObj,
            errormsg: "success",
            open: true,
            catchmsg: `expert says that correct Answer is ${res.data.correctAnswer}`,
          });
          setLifeLinesCount([...lifelinesCount, { key: "expert-advice" }]);
          start();
        }
      });
    }
  };

  const doubleDip = () => {
    const checkLifeline = lifelinesCount.filter(
      (item) => item.key == "double-dip"
    );
    if (lifelinesCount.length === 4) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: "You have used all lifelines",
        open: true,
      });
    } else if (checkLifeline.length > 0) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: `double-dip is already used before choose another`,
        open: true,
      });
    } else {
      pause();
      setLoading(true);
      let AllQueSet = stateObj.Quiz_Set;
      const active = stateObj.activeStep;

      const modified = AllQueSet.map((item, idx) => {
        if (idx === active) {
          item.doubleDip = true;
          return item;
        }
        return item;
      });
      setstateObj({
        ...stateObj,
        Quiz_Set: modified,
        errormsg: "success",
        open: true,
        catchmsg: `double -dip is being used`,
      });
      setLifeLinesCount([...lifelinesCount, { key: "double-dip" }]);
      start();
    }
  };

  const onInputChange = (e) => {
    let Quiz_Set = stateObj.Quiz_Set;
    const nexstateObj = Quiz_Set.map((card) => {
      if (String(card.queno) !== e.target.name) return card;
      return {
        ...card,
        options: card.options.map((opt) => {
          const checked = opt.que_options === e.target.value;
          return {
            ...opt,
            selected: checked,
          };
        }),
      };
    });

    setstateObj({ ...stateObj, Quiz_Set: nexstateObj });
  };

  const getHint = async () => {
    await API.post("/test/get_hint", {
      question: stateObj.Quiz_Set[stateObj.activeStep],
    }).then((res) => {
      console.log("response", res);

      setstateObj({
        ...stateObj,
        hint_text: res.data.hint,
        errormsg: "success",
        open: true,
        catchmsg: res.data.hint,
      });
      dispatch({ type: "UPDATE", payload: res.data.coins });
    });
  };

  const handleFlipLifeLine = async () => {
    console.log("Flip the question LifeLine");
    console.log(stateObj.activeStep);
    console.log(stateObj.Quiz_Set[stateObj.activeStep]);
    const checkLifeline = lifelinesCount.filter((item) => item.key == "flip");
    if (lifelinesCount.length === 4) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: "You have used all lifelines",
        open: true,
      });
    } else if (checkLifeline.length > 0) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: `flip the question is already used before choose another`,
        open: true,
      });
    } else {
      pause();

      const filteredQuestionSameCategory = stateObj.Quiz_Set.filter((item) => {
        if (
          item.difficulty === stateObj.Quiz_Set[stateObj.activeStep].difficulty
        ) {
          return item;
        }
      });

      console.log(filteredQuestionSameCategory);
      await API.post("/test/flip-question", {
        subjectId:stateObj.subjectId,
        collectedArray: filteredQuestionSameCategory,
        difficulty: stateObj.Quiz_Set[stateObj.activeStep].difficulty,
        index:stateObj.activeStep
      }).then((res) => {
        console.log(res);
        const currentStep = stateObj.activeStep;
        console.log(currentStep, "current");
        const newQuizSet = stateObj.Quiz_Set.map((item, idx) => {
          if (idx === currentStep) {
            item = res.data.data;
            return item;
          }
          return item;
        });
        console.log(newQuizSet);

        setstateObj({
          ...stateObj,
          Quiz_Set: newQuizSet,
          errormsg: "success",
          open: true,
          catchmsg: `Flip-the question Applied`,
        });
        setLifeLinesCount([...lifelinesCount, { key: "flip" }]);
        start();
      });
    }
  };
  const characterMapped = ["A", "B", "C", "D"];
  const onInputChangeDoubleDip = (e) => {
    console.log("vvv", e.target.value);
    console.log("vvv", e.target.name);
    console.log(e.target.checked);

    const check = stateObj.Quiz_Set[e.target.name].options.filter(
      (opt) => opt.que_options === e.target.value && opt.selected == true
    );
    
    let flag = false;
    if (check.length >= 1) {
      flag = true;
    }
    const filtered = stateObj.Quiz_Set[e.target.name].options.filter(
      (opt) => opt.selected === true
    );
    console.log(filtered, "filter");
    if (filtered.length === 2 && !flag) {
      setstateObj({
        ...stateObj,
        errormsg: "error",
        catchmsg: "You have already marked 2 options",
        open: true,
      });
    } else {
      const nexstateObj = stateObj.Quiz_Set.map((card) => {
        if (String(card.queno) !== e.target.name) return card;
        return {
          ...card,
          options: card.options.map((opt) => {
            const checked =
              opt.que_options === e.target.value ? !opt.selected : opt.selected;

            return {
              ...opt,
              selected: checked,
            };
          }),
        };
      });
      setstateObj({ ...stateObj, Quiz_Set: nexstateObj });

      console.log(nexstateObj);
    }
  };

  const onsubmit = async () => {
    pause();
    setstateObj({ ...stateObj, booleanonsubmit: true });
    console.log(stateObj.Quiz_Set);
    setLoading(true);
    API.post("/test/checkresult", {
      testDetails: stateObj.testDetails,
      testId: test_id,
      responseSet: stateObj.Quiz_Set,
      lifelinesCount: lifelinesCount,
      coins:state.user.coins
    }).then((res) => {
      console.log(res);

      setstateObj({
        ...stateObj,
        booleanonsubmit: true,
        Total: res.data.marks,
      });
    
      dispatch({ type: "UPDATE", payload: res.data.coins });
      setLoading(false);
    });
  };

  const Snackbarrender = () => {
    return stateObj.open ? (
      <Snackbar
        open={stateObj.open}
        autoHideDuration={5000}
        onClose={handleClose}
        style={{ marginTop: "0px", width: "100%" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={stateObj.errormsg}
        >
          {stateObj.catchmsg}
        </MuiAlert>
      </Snackbar>
    ) : null;
  };

  return (
    //   state.isAuthenticated?
    <div className="Quiz_render_container" style={{ width: "100%" }}>
      <Header />

      <div style={{ backgroundColor: "black" }}>
        {stateObj.booleanonsubmit ? (
          <div
            className="Quiz-DisplayResult"
            style={{ width: "70%", color: "white" }}
          >
            {!loading ? (
              <div>
                <h2> The score is {stateObj.Total} Out Of 15 </h2>
                <div>
                  To know about Coins and Rewards from this test visit Insights
                  Page
                </div>
              </div>
            ) : (
              <Box sx={{ width: "100%" }}>
                <LinearProgress />
              </Box>
            )}
          </div>
        ) : (
          <>
            <div className="Quiz_container_display">
              <div>
                {stateObj.Quiz_Set.map((item, index) => {
                  if (Math.abs(stateObj.activeStep - index) <= 0) {
                    return (
                      <div
                        key={index}
                        className="question_container"
                        style={{
                          borderRadius: "14px",
                          backgroundColor: "#E0FFFF",
                          height: "500px",
                          fontSize: "1rem",
                        }}
                      >
                        <div className="Quiz_que">
                          <b>
                            {index + 1}.{item.que}
                          </b>
                          
                            {item.difficulty==="EASY"?<span
                            style={{
                              marginLeft: "6px",
                              padding: "7px",
                              color: "white",
                              backgroundColor: "green",
                              borderRadius: "9px",
                            }}
                          > Level 1
                          </span>: <></>}
                          {item.difficulty==="MEDIUM"?<span
                            style={{
                              marginLeft: "6px",
                              padding: "7px",
                              color: "white",
                              backgroundColor: "green",
                              borderRadius: "9px",
                            }}
                          > Level 2
                          </span>: <></>}
                          {item.difficulty==="HARD"?<span
                            style={{
                              marginLeft: "6px",
                              padding: "7px",
                              color: "white",
                              backgroundColor: "green",
                              borderRadius: "9px",
                            }}
                          > Level 3
                          </span>: <></>}
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto auto",
                          }}
                        >
                          {item.options.map((ans, index_ans) => {
                            index_ans = index_ans + 1;
                            return (
                              <div
                                key={index_ans}
                                className="Quiz_multiple_options"
                                style={{
                                  borderRadius: "15px",
                                  margin: "1rem",
                                  border: "1px solid black",
                                  padding: "10px",
                                  backgroundColor: `${
                                    ans.selected ? "yellow" : "#4169E1"
                                  }`,
                                  color: `${ans.selected ? "black" : "white"}`,
                                  fontWeight: "bold",
                                }}
                              >
                                {ans.hasOwnProperty("fiftyUsed") ? (
                                  <></>
                                ) : (
                                  <>
                                    <b>
                                      {" "}
                                      {characterMapped[index_ans - 1]}]{" "}
                                      {ans.que_options}
                                    </b>

                                    {item.hasOwnProperty("doubleDip") ? (
                                      <input
                                        type="checkbox"
                                        name={item.queno}
                                        value={ans.que_options}
                                        onChange={onInputChangeDoubleDip}
                                        key={index_ans}
                                        checked={ans.selected}
                                      />
                                    ) : (
                                      <input
                                        type="radio"
                                        name={item.queno}
                                        value={ans.que_options}
                                        checked={!!ans.selected}
                                        onChange={onInputChange}
                                        key={index_ans}
                                      />
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <div>
                          <div style={{ textAlign: "center" }}>
                            <div>
                              <b>Time left</b>
                            </div>
                            <div style={{ fontSize: "40px" }}>
                              <b>
                                <span>{minutes}</span>:<span>{seconds}</span>
                              </b>
                            </div>
                            <p>{isRunning ? "Running" : "Not running"}</p>
                          </div>
                          <div>
                            <b>Lifelines Available below</b>

                            <div className="lifelines_tests">
                              <div>
                                <span
                                  onClick={() => {
                                    Lifelineuse5050();
                                  }}
                                >
                                  50:50 {check5050 ? <CloseIcon /> : ""}{" "}
                                </span>
                              </div>
                              <div>
                                <span
                                  onClick={() => {
                                    handleFlipLifeLine();
                                  }}
                                >
                                  Flip-Question {checkFlip ? <CloseIcon /> : ""}
                                </span>
                              </div>
                              <div>
                                <span
                                  onClick={() => {
                                    expertAdvice();
                                  }}
                                >
                                  Expert Advice{" "}
                                  {checkExpertAdvice ? <CloseIcon /> : ""}
                                </span>
                              </div>
                              <div>
                                <span
                                  onClick={() => {
                                    doubleDip();
                                  }}
                                >
                                  Double dip{" "}
                                  {checkdoubleDip ? <CloseIcon /> : ""}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            {stateObj.activeStep > 9 && state.user.coins > 60 && (
                              <div>
                                Hint:{" "}
                                <button className="get_hint" onClick={getHint}>
                                  GET_HINT
                                </button>
                                {/* <div><b> <span>{stateObj.hint_text}</span></b>  </div> */}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
                <div className="Quiz-MobileStepper">
                  <MobileStepper
                    style={{ marginTop: "1rem", borderRadius: "14px" }}
                    variant="dots"
                    title="1-15 questions"
                    steps={stateObj.Quiz_Set.length}
                    position="static"
                    activeStep={stateObj.activeStep}
                    nextButton={
                      stateObj.activeStep === 14 ? (
                        <Button size="small" onClick={onsubmit}>
                          Submit
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          onClick={handleNext}
                          disabled={
                            stateObj.activeStep === stateObj.Quiz_Set.length
                          }
                        >
                          Next
                        </Button>
                      )
                    }
                  />
                </div>
                <button style={{backgroundColor:"white",color:"black",padding:10,margin:10, borderRadius:10}} onClick={onsubmit}> Submit Test</button>
              </div>
            </div>
          </>
        )}
      </div>

      {Snackbarrender()}
    </div>
  );
};

export default Quiz;
