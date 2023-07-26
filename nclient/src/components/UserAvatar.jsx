import style from './UserAvatar.module.css';



const UserAvatar = ({ imageSrc, username }) => {
    return (
        <div className={style.UserAvatar}>
            <span>{username}</span>
            <img src={imageSrc} alt="user profile"></img>
        </div>
    );
}

export default UserAvatar;