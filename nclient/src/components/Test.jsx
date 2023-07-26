import API from "../api/util";
import "../components/Test.css";
const Test = ({obj}) =>{
  
  const handleTestStart = async (test_id) =>{
    console.log(test_id)

    await API.post("/test/checktest",{testId:test_id}).then(res=>{
         console.log(res,"response");
        //  if(res.data.attemp){
          
                     window.location.href = "/test/"+test_id;
        //  }
        //  else{
        //    alert("you have already attempted this test before");
        //  }
       
    })
  }

  return (
    <div className="test_title">
      <div>

            <h2>{obj?.testName}</h2> 
      </div>
      <div>
            <p>{obj?.testDescription}</p>
            <p>
              {obj?.rewards}
            </p>
           
      </div>
      <div className="poweredTo">
              by :<b>{obj?.testPoweredBy}</b> 
      </div>
      <div>
        <button className="test_start" onClick={()=>handleTestStart(obj._id)}>Start Test</button>
      </div>
    </div>
  )
}
export default Test;