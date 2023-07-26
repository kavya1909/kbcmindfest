import MainLogo from './MainLogo';

import SignIn from './SignIn';
import style from './Header.module.css';


const Header = () => {
  return (
    <div className={style.header}>
      <MainLogo />
    
      <SignIn />
    </div>
  )
}

export default Header;