import {
  Button,
  DialogTitle,
  Dialog,
  DialogContentText,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import {
  FC,
  useRef,
  useState,
  useContext,
  createContext,
  useReducer,
  useEffect,
} from "react";
import Header from "../../components/Header";


import API from "../../api/util";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreatableSelect from "react-select/creatable";
import { AuthContext } from "../../App";

import Subject from "../../components/Subject";
import "./Home.css";


export const reducer = (state, action) => {
  switch (action.type) {
    case "UPDATE":
      return [...action.payload];
    default:
      return [];
  }
};

const Home = () => {
  const [searchResults, dispatch] = useReducer(reducer, []);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const { state } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [singleValueForSubject, setSingleValue] = useState("");

  const [openModalForTest, setOpenModalForTest] = useState(false);
  const config = {
    readonly: false,
    height: 400,
    uploader: {
      insertImageAsBase64URI: true,
    },
  };

  const editor = useRef(null);
  const [content, setContent] = useState("Start writing");

  const [flag, setFlag] = useState(false);
  useEffect(() => {
    const fetchSubjects = async () => {
      API.get("/subject/all").then((res) => {
        console.log(res, "response");
        setSubjects(res.data);
      });
    };
    fetchSubjects();
  }, []);
  useEffect(()=>{
    const TestCreateTracker = async () =>{
       singleValueForSubject!=="" &&
        singleValueForSubject!==null  &&
        singleValueForSubject !==undefined && 
       await API.post("/subject/TestCreateCheck", { subjectId:singleValueForSubject?.singleValueForSubject?.value })
       .then((res) => {
         console.log(res);
 
         console.log(res.data.QuestionLength);
         if (res.data.QuestionLength >= 29) {
           setOpenModalForTest(true);
         }
         else{
           toast.error("Don't have enough questions, Question Count is "+res.data.QuestionLength);
         }
       })
       .catch((e) => {
         toast.error(
           "something went wrong OR Test already exists for the "+singleValueForSubject?.singleValueForSubject?.label
         );
       });
    }
    
    TestCreateTracker();
},[singleValueForSubject])
  const options = subjects && subjects.map((item) => {
    return { value: item._id, label: item.subject };
  });

  const handleOnChange = async (value) => {
    await setSingleValue({ singleValueForSubject: value });
    console.log("xyz",singleValueForSubject);
   /* await API.post("/subject/TestCreateCheck", { subjectId: value.value })
      .then((res) => {
        console.log(res);

        console.log(res.data.QuestionLength);
        if (res.data.QuestionLength >= 29) {
          setOpenModalForTest(true);
        }
        else{
          toast.error("Don't have enough questions, Question Count is ",res.data.QuestionLength);
        }
      })
      .catch((e) => {
        toast.error(
          "something went wrong OR Test already exists for the "+singleValueForSubject?.singleValueForSubject?.label
        );
      });*/
  };
  const handleSubmit = async () => {
    const subject = {
      Title: document.querySelector("#subject").value,
    };
    console.log(subject.Title);
    console.log(state.isAuthenticated);
    console.log(state.user);
    console.log("new Subject Requested");
    if (subject.Title.length >= 1) {
      toast.info("your subject is being processed in background");
      API.post("/subject/addsubject", { subject }).then((res) => {
        console.log("response subject",res);
        if (res.status == 200) {
          setSubjects(res.data.subjects);
        }
      });
    }
    setShowNewProjectModal(false);
  };
  console.log("after changing ", singleValueForSubject);

  const handleTestSubmit = async () => {
    const prepareTestObject = {
      testName: document.querySelector("#testName").value,
      rewards: document.querySelector("#Test_Rewards").value,
      testPoweredBy: document.querySelector("#Test_PoweredBy").value,
      testDescription: document.querySelector("#Test_Description").value,
      subjectId: singleValueForSubject.singleValueForSubject.value,
      userId: state.user._id,
    };
    if (
      prepareTestObject.testName.length === 0 ||
      prepareTestObject.rewards.length === 0 ||
      prepareTestObject.testPoweredBy.length === 0 ||
      prepareTestObject.testDescription.length === 0
    ) {
      toast.error("Fields can't be empty try again !!");
      setOpenModalForTest(false);
    } else {
      toast.info("your Test is being processed in background...please wait");
      await API.post("/test/create", { prepareTestObject: prepareTestObject })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            toast("Test has been created successfully");
          }
          setOpenModalForTest(false);
        })
        .catch((e) => {
          toast.success(
            "we are sorry ! we couldn't create the test at the moment ...please try later"
          );

          setOpenModalForTest(false);
        });
    }
    console.log(prepareTestObject);
  };
  return (
    <>
     
        <Header />
        <ToastContainer
          position="top-right"
          theme="dark"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="grid-test-kbc-part">
          <div>
            <center>
          <Button
                  variant="contained"
                  style={{ backgroundColor: "white", color: "blueviolet",marginTop:20 }}
                  onClick={() => setShowNewProjectModal(true)}
                >
                  Add Subject
                </Button><br/>
                </center>
            {subjects.map((item, idx) => {
              console.log(item);
              return (
                <Subject
                  subject={item.subject}
                  subjectId={item._id}
                  key={idx}
                />
              );
            })}
          </div>
          <div>
            {state.isAuthenticated && (
              <div
                style={{
                  fontSize: "1.25rem",
                  margin: "10px auto",
                  padding: "0 20px",
                }}
              >
                
                <div className="test_creation_mode">
                  <div>
                    <h3>Create Test </h3>
                  </div>
                  <div>
                    <p>
                      Choose a subject for which you want to create the
                      test(min-Questions-Rule:29)
                    </p>
                  </div>
                  <CreatableSelect
                    options={options}
                    onChange={handleOnChange}
                    value={singleValueForSubject}
                    showNewOptionAtTop={false}
                  />
                </div>
              </div>
            )}
            {showNewProjectModal && (
              <Dialog
                open={showNewProjectModal}
                onClose={() => setShowNewProjectModal(false)}
              >
                <DialogTitle>Add Subject</DialogTitle>
                <DialogContent>
                  <DialogContentText></DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="subject"
                    label="subject Title"
                    type="text"
                    name="Title"
                    fullWidth
                    variant="standard"
                    required
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowNewProjectModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} type="submit">
                    Done
                  </Button>
                </DialogActions>
              </Dialog>
            )}
        

            {openModalForTest && (
              <Dialog
                open={openModalForTest}
                onClose={() => setOpenModalForTest(false)}
              >
                <DialogTitle>
                  ADD TEST FOR{" "}
                  {singleValueForSubject?.singleValueForSubject?.label}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText></DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="testName"
                    label="test Name"
                    type="text"
                    name="Title"
                    fullWidth
                    variant="standard"
                    // onChange={handleChangeForm('Title')}
                    required
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="Test_Rewards"
                    label="Rewards"
                    type="text"
                    name="Rewards"
                    fullWidth
                    variant="standard"
                    // onChange={handleChangeForm('Title')}
                    required
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="Test_Description"
                    label="Test Description"
                    type="text"
                    name="Rewards"
                    fullWidth
                    variant="standard"
                    // onChange={handleChangeForm('Title')}
                    required
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="Test_PoweredBy"
                    label="Test Powered By"
                    type="text"
                    name="TestPoweredBy"
                    fullWidth
                    variant="standard"
                    required
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenModalForTest(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTestSubmit} type="submit">
                    Done
                  </Button>
                </DialogActions>
              </Dialog>
            )}
          </div>
        </div>
   
    </>
  );
};

export default Home;
