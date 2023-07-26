import { FC } from "react";
import style from "./MainLogo.module.css";
import { Link } from "react-router-dom";

const MainLogo = () => {
    return <div className={style.MainLogo}><Link to="/">KBC-MindFest</Link></div>;
}

export default MainLogo;
