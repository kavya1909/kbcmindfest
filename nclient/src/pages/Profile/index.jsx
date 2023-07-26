import { useState,useEffect } from "react";
import API from '../../api/util';
import Header from "../../components/Header";
import "./profile.css"
const Profile=()=>{
    const [userinfo,setUsers] = useState([]);
 
    useEffect(()=>{
       
        const fetchUsers =  ()=>{
            API.get("/user/displayinfo").then((res)=>{
                console.log(res,"response");
                
                setUsers(res.data);
                
            })
        }
        fetchUsers();
     
       
     },[])
     return(
     <>
    <Header/>
       <div className="user">
          <div className="user-heading" >
              User Details
              </div><hr/><br/>
              
              <div className="user-content" >
                    { userinfo.map((item,idx)=>{
                       
                       //document.writeln("<h1>Username:",item.username,"</h1><h2>Email:",item.email,"</h2><h3>Password:",item.password,"</h3><br/>");
                       console.log(item);
                        return (<div>User Name:{item.uname}<br/>
                       Email:{item.email}<br/>
                        Coins :{item.coins}<br/>
                        
                        </div>);
                   })} 
                   
                </div>  
                </div>
                
                
     
     </>)
}
export default Profile;
