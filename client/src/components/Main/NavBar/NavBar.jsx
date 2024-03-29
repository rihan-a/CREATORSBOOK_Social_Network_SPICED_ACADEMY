// NAVBAR COMPONENT
// Component to render NavBar elements( Hamburger Menu, Logo, Profile Picture )

import Logo from "./Logo";
import { useState } from "react";
import ProfilePicture from "./ProfilePicture";
import Logout from "./Logout";
import { useSelector } from "react-redux";
import "./NavBar.css";
import { Link } from "react-router-dom";
import DarkModeSwitch from "../../DarkModeSwitch/DarkModeSwitch";

function NavBar(props) {
    // Get activeNavBar state from Redux store
    const activeNavBar = useSelector((state) => {
        return state.navBarColor.navBarActive;
    });

    const [hamburgerToggle, setHamburgerToggle] = useState(false);

    // Toggle Hamburger Menu
    const hamburgerMenuHandler = () => {
        setHamburgerToggle(!hamburgerToggle);
    };

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

                <div className="empty-space-navbar"></div>

                <Logo />

                {hamburgerToggle && (
                    <>
                        <div className="hamburger-menu-container">
                            <Link
                                className={
                                    activeNavBar == "feed"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/wall"
                                onClick={hamburgerMenuHandler}
                            >
                                CREATORS FEED
                            </Link>

                            <div className="menu-line"></div>
                            <Link
                                className={
                                    activeNavBar == "creators"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/"
                                onClick={hamburgerMenuHandler}
                            >
                                FIND CREATORS
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
                                    activeNavBar == "sketch"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/collabspaces"
                                onClick={hamburgerMenuHandler}
                            >
                                COLLAB SKETCHING SPACE
                            </Link>

                            <div className="menu-line"></div>
                            <Link
                                className={
                                    activeNavBar == "ai"
                                        ? "nav-link active"
                                        : "nav-link"
                                }
                                to="/collabspaces/ai"
                                onClick={hamburgerMenuHandler}
                            >
                                COLLAB AI SPACE
                                <span className="beta">beta</span>
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
                            <div className="menu-line"></div>

                            <div className="hamburger-dark-switch">
                                <DarkModeSwitch />
                            </div>
                        </div>
                        <div
                            className="empty-backdrop"
                            onClick={hamburgerMenuHandler}
                        ></div>
                    </>
                )}

                <div className="navbar-dark-switch">
                    <DarkModeSwitch />
                </div>

                <ProfilePicture
                    openModalHandler={props.openModalHandler}
                    imgUrlHandler={props.imgUrlHandler}
                />
            </div>
        </>
    );
}
export default NavBar;
