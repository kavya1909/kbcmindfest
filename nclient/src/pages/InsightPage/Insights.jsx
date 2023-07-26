import { useEffect, useState } from "react";
import API from "../../api/util";
import Header from "../../components/Header"
import Reward from "../../components/Reward";
import "./insights.css";

/**
 * 
 * updates
 */
const Insights = () =>{


  const [rewards,setRewards] = useState([]);
   
  useEffect(()=>{
           const fetchInsights  = async () =>{
                  API.post("/insight/get-all-insights").then((res)=>{
                    console.log("insights",res.data);
                    setRewards(res.data.insights);
                })
           }
           fetchInsights();
},[]);
  return (

    <div>
     <Header/>
     <div class="rewards-kbc">
       {
         rewards && rewards.map((item,idx)=>{
                     return <Reward key={idx} data={item}/>
         })
       }
   
     </div>
      
    </div>

  )
}
export default Insights;