import Logo from "./Logo";
import ProfilePicture from "./ProfilePicture";
import { useSelector } from "react-redux";
import "./NavBar.css";

import { Link } from "react-router-dom";

function NavBar(props) {
    const activeNavBar = useSelector((state) => {
        return state.navBarColor.navBarActive;
    });

    //console.log("navbar", activeNavBar);

    return (
        <>
            <div className="nav-bar">
                
                <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                    <path d="M5.15 37.4v-4.7h37.7v4.7Zm0-11.05v-4.7h37.7v4.7Zm0-11.05v-4.75h37.7v4.75Z" />
                </svg>

                <Link
                    className={
                        activeNavBar == "collabs"
                            ? "nav-link active"
                            : "nav-link"
                    }
                    to="/mycollabs"
                >
                    MY COLLABS
                </Link>
                <Logo />
                <Link
                    className={
                        activeNavBar == "creators"
                            ? "nav-link active"
                            : "nav-link"
                    }
                    to="/creators"
                >
                    FIND CREATORS
                </Link>
                <Link
                    className={
                        activeNavBar == "chat" ? "nav-link active" : "nav-link"
                    }
                    to="/chat"
                >
                    CHAT
                </Link>

                <ProfilePicture
                    openModalHandler={props.openModalHandler}
                    imgUrlHandler={props.imgUrlHandler}
                />
            </div>
        </>
    );
}
export default NavBar;
