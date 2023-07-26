import { useEffect, useState } from "react";
import API from "../../api/util";
import Header from "../../components/Header";
import Test from "../../components/Test"
import "../../components/Test.css";
const Tests = () =>{
  const [tests,setTests] = useState([]);

  useEffect(()=>{
     
     const getAllTests = async () =>{
       await API.post("/test/testlist").then((res)=>{
         console.log(res);
         setTests(res.data.tests);
       })
     }
     getAllTests();
  },[])

  return (
    <div classname="test_list">
      <Header/>
      <div className="test_header"><h2>All Available Tests </h2></div>
      <div className="test_list_container">
        {
          tests?.map((item)=>{
            return <Test obj = {item}/>
          })
        }
      </div>
      
    </div>
  )
}
export default Tests;