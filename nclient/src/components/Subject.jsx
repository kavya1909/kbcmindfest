import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import API from '../api/util';
import "./Subject.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Subject = ({subject,subjectId}) => {

    const [open,setOpen] = useState(false);
    console.log(subject,"subject Id",subjectId);
    const [prepareObj,setPrepareObj] = useState({
          questionName:"",
          optionA:"",
          optionB:"",
          optionC:"",
          optionD:"",
          hint:"",
          correctAnswer:"A",
          difficultyLevel:"EASY",
          subjectId:subjectId
    });

    const handleSubmitQuestion = async () => {


         console.log("checking object before submitting");
         console.log(prepareObj);
         
         API.post("/subject/addquestion",prepareObj).then((res)=>{
           console.log(res);
           toast.info("The quesiton has been added");
         })
         setPrepareObj({ questionName:"",
         optionA:"",
         optionB:"",
         optionC:"",
         optionD:"",
         hint:"",
         correctAnswer:"A",
         difficultyLevel:"EASY",
         subjectId:subjectId
        });
         setOpen(false);
    }

    console.log("prepared Object",prepareObj);
    return (

        <div className="subject_section_kbc">
           {subject}

            <button style={{backgroundColor:"blueviolet",color:"white",marginLeft:30,padding:5}} onClick={()=>{setOpen(true)}}>Add Questions</button>
            <Dialog open={open} onClose={()=>setOpen(false)}>
        <DialogTitle>Add Question for {subject} </DialogTitle>
        <DialogContent>
          <DialogContentText>
        
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="questionName"
            label="Question"
            type="text"
            value={prepareObj.questionName}
            onChange={(event)=>{
              console.log(event.target.value);
              setPrepareObj({...prepareObj,questionName:event.target.value})
  
            }}
            fullWidth
            variant="standard"
          />
            <div style={{display:"grid",gridTemplateColumns:"auto auto"}}>
            <TextField
            autoFocus
            margin="dense"
            id="optionA"
            label="OptionA"
            type="text"
            value={prepareObj.optionA}
            onChange={(event)=>{
              console.log(event.target.value);
              setPrepareObj({...prepareObj,optionA:event.target.value})
  
            }}
            fullWidth
            variant="standard"
          />
            <TextField
            autoFocus
            margin="dense"
            id="optionB"
            label="OptionB"
            type="text"
            value={prepareObj.optionB}
            onChange={(event)=>{
              console.log(event.target.value);
              setPrepareObj({...prepareObj,optionB:event.target.value})
  
            }}
            fullWidth
            variant="standard"
          />
            <TextField
            autoFocus
            margin="dense"
            id="optionC"
            label="OptionC"
            type="text"
            value={prepareObj.optionC}
            onChange={(event)=>{
              console.log(event.target.value);
              setPrepareObj({...prepareObj,optionC:event.target.value})
  
            }}
            fullWidth
            variant="standard"
          />
            <TextField
            autoFocus
            margin="dense"
            id="optionD"
            label="OptionD"
            type="text"
            value={prepareObj.optionD}
            onChange={(event)=>{
              console.log(event.target.value);
              setPrepareObj({...prepareObj,optionD:event.target.value})
  
            }}
            fullWidth
            variant="standard"
          />

            </div>
            <div>
            <TextField
            autoFocus
            margin="dense"
            id="hint"
            label="explanation"
            type="text"
            value={prepareObj.hint}

            onChange={(event)=>{
              console.log(event.target.value);
              setPrepareObj({...prepareObj,hint:event.target.value})
  
            }}
            fullWidth
            variant="standard"
          />


            </div>
            <div>
            <div>
            <div><h4>Correct answer</h4></div>
            <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={age}
          aria-labelledby='Choose Correct Answer'
          label="Options"
          value={prepareObj.correctAnswer}
          onChange={(event)=>{
            console.log(event.target.value);
            setPrepareObj({...prepareObj,correctAnswer:event.target.value})

          }}
        >
          <MenuItem value={"A"}>OptionA</MenuItem>
          <MenuItem value={"B"}>OptionB</MenuItem>
          <MenuItem value={"C"}>OptionC</MenuItem>
          <MenuItem value={"D"}>OptionD</MenuItem>
        </Select>

            </div>
            <div>
              <div><h4>Difficulty Level</h4></div>
            <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={age}
          aria-labelledby='Choose Difficulty Level'
          label="Difficulty"
          value={prepareObj.difficultyLevel}
          onChange={(event)=>{
            console.log(event.target.value);
            setPrepareObj({...prepareObj,difficultyLevel:event.target.value})

          }}
        >
          <MenuItem value={"EASY"}>EASY</MenuItem>
          <MenuItem value={"MEDIUM"}>MEDIUM</MenuItem>
          <MenuItem value={"HARD"}>HARD</MenuItem>
         
        </Select>

            </div>
            <div>
              
            </div>
            </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitQuestion}>Add Question</Button>
        </DialogActions>
      </Dialog>
        </div>
    )
}
export default Subject;