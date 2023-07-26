import { Button } from "@material-ui/core";
import "./Insights.css";
const Reward = ({data}) =>{
     
   const {insight,testName,coins_earned,lifelinesCount,created_At,score}= data;
 
    var ans=new Date(created_At);
    console.log(ans);
   

   return (


        <div className="insights">

           <div>
              <div className="test_name_in"><b>{testName}</b></div>
              <div className="insight-flex">
                 <div>score:<b>{score}/15</b></div>
                 <div>coins_earned:     <Button color="primary" > <b>{parseInt(coins_earned, 10)}</b></Button></div>
                
              </div>
              <div> 
                 <div>Submitted on :{ans.getDate()+
          "/"+(ans.getMonth()+1)+
          "/"+ans.getFullYear()}</div>  </div>
              <div>
                     <div>
                        got Reward :
                       <q>{insight}</q>
                    </div>
              </div>
              <div>
                 <span>lifelines Summary:</span>
                 {
                    lifelinesCount && lifelinesCount.map((item,idx)=>{
                           return <Button color="secondary" key={idx} > <b>{item.key}</b></Button>
                    })
                 }
                 
             
              </div>
           </div>
        </div>

   )

}
export default Reward;