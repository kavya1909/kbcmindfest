import { FC, useContext } from "react";
import { AuthContext } from "../App";
import UserAvatar from "./UserAvatar";
import style from "./SignIn.module.css";
import DropDownMenu from "./DropDownMenu";
import API from "../api/util";
import { Link } from "react-router-dom";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Badge } from "@mui/material";
const SignIn = () => {
  const { state } = useContext(AuthContext);

  const handleLogout = () => {
    API.delete("/auth/api/v1/logout").then((res) => {
      window.location.reload();
    });
  };

  return (
    <div className={style.SignIn}>
      {state?.isAuthenticated && state?.user && (
        <>
          <div style={{ marginRight: "20px", marginTop: "8px" }}>
            <a href="/insights">Insights</a>
          </div>
          <div style={{ marginRight: "20px", marginTop: "8px" }}>
            <a href="/tests-available">Tests</a>
          </div>
          <div style={{ marginRight: "20px", marginTop: "8px" }}>
            <a href="/create-test">Create Test</a>
          </div>

          <div style={{ marginRight: "20px", marginTop: "8px" }}>
          <EmojiEventsIcon/>
                    <span style={{marginLeft:"20px",marginTop:"-20px",paddingTop:"-17px"}}>{state?.user.coins}</span>
                   
          </div>
        </>
      )}
      {state.isAuthenticated ? (
        <DropDownMenu
          icon={
            <UserAvatar
              imageSrc={state?.user?.image}
              username={state?.user?.uname}
            />
          }
          menuItems={[
            <Link to="/profile">Profile</Link>,
            <div onClick={handleLogout}>Logout</div>,
          ]}
        />
      ) : (
        <>
          <div
            id="g_id_onload"
            data-client_id="496941184973-m0q8g3uns4uo9lgll6r9mq4jfh703a6j.apps.googleusercontent.com"
            data-login_uri={`http://localhost:5000/auth/api/google`}
            data-auto_prompt="false"
          ></div>
          <div
            className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left"
          ></div>
        </>
      )}
    </div>
  );
};

export default SignIn;
