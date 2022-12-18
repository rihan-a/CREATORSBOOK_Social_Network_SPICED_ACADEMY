import Logo from "./Logo";
import { useState } from "react";
import ProfilePicture from "./ProfilePicture";
import Logout from "./Logout";
import { useSelector } from "react-redux";
import "./NavBar.css";

import { Link } from "react-router-dom";

function NavBar(props) {
    const activeNavBar = useSelector((state) => {
        return state.navBarColor.navBarActive;
    });

    const [hamburgerToggle, setHamburgerToggle] = useState(false);

    const hamburgerMenuHandler = () => {
        setHamburgerToggle(!hamburgerToggle);
    };

    //console.log("navbar", activeNavBar);

    return (
        <>
            <div className="nav-bar">
                <div
                    className="hamburger-menu-btn"
                    onClick={hamburgerMenuHandler}
                >
                    {hamburgerToggle ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="48"
                            width="48"
                        >
                            <path d="M12.45 38.7 9.3 35.55 20.85 24 9.3 12.5l3.15-3.2L24 20.8 35.55 9.3l3.15 3.2L27.2 24l11.5 11.55-3.15 3.15L24 27.2Z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="48"
                            width="48"
                        >
                            <path d="M5.15 37.4v-4.7h37.7v4.7Zm0-11.05v-4.7h37.7v4.7Zm0-11.05v-4.75h37.7v4.75Z" />
                        </svg>
                    )}
                </div>

                <Logo />

                {hamburgerToggle && (
                    <div className="hamburger-menu-container">
                        <Link
                            className={
                                activeNavBar == "feed"
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            to="/"
                            onClick={hamburgerMenuHandler}
                        >
                            CREATORS FEED
                        </Link>
                        <div className="menu-line"></div>

                        <Link
                            className={
                                activeNavBar == "collabs"
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            to="/mycollabs"
                            onClick={hamburgerMenuHandler}
                        >
                            MY COLLABS
                        </Link>
                        <div className="menu-line"></div>

                        <Link
                            className={
                                activeNavBar == "creators"
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            to="/creators"
                            onClick={hamburgerMenuHandler}
                        >
                            FIND CREATORS
                        </Link>
                        <div className="menu-line"></div>
                        <Link
                            className={
                                activeNavBar == "chat"
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            to="/chat"
                            onClick={hamburgerMenuHandler}
                        >
                            CHAT
                        </Link>

                        <div className="menu-line"></div>
                        <Link
                            className={
                                activeNavBar == "online"
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            to="/online"
                            onClick={hamburgerMenuHandler}
                        >
                            ONLINE CREATORS
                        </Link>

                        <div className="menu-line"></div>

                        <Logout />
                    </div>
                )}

                <ProfilePicture
                    openModalHandler={props.openModalHandler}
                    imgUrlHandler={props.imgUrlHandler}
                />
            </div>
        </>
    );
}
export default NavBar;
