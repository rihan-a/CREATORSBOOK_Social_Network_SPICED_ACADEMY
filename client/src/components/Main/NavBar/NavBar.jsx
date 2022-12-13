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
                <ProfilePicture
                    openModalHandler={props.openModalHandler}
                    imgUrlHandler={props.imgUrlHandler}
                />
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
            </div>
        </>
    );
}
export default NavBar;
