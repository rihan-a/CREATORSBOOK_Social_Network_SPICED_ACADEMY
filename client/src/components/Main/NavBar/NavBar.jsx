import Logo from "./Logo";
import ProfilePicture from "./ProfilePicture";
import Logout from "./Logout";
import "./NavBar.css";

import { Link } from "react-router-dom";

function NavBar(props) {
    return (
        <>
            <div className="nav-bar">
                <ProfilePicture
                    openModalHandler={props.openModalHandler}
                    imgUrlHandler={props.imgUrlHandler}
                />
                <Link className="nav-link" to="/mynetwork">
                    MY NETWORK
                </Link>
                <Logo />

                <Link className="nav-link" to="/creators">
                    FIND CREATORS
                </Link>
                <Logout />
            </div>
        </>
    );
}
export default NavBar;
