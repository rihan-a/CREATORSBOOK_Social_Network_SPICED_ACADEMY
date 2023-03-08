import NavBar from "./NavBar/NavBar";
import Profile from "./Profile/Profile";
import FindCreators from "./FindCreators";
import MyCollabs from "./MyCollabs";
import OtherCreatorProfile from "./OtherCreatorProfile/OtherCreatorProfile";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "./Chat/Chat";
import WallFeed from "./WallFeed/WallFeed";
//import Footer from "./Footer/Footer";
import OnlineCreators from "./OnlineCreators/OnlineCreators";
import CollabSpaces from "./CollabSpaces/CollabSpaces";
import AiSpace from "./CollabSpaces/AiSpace/AiSpace";
import VisitorApi from "../VisitorApi";
import { useDispatch } from "react-redux";
import { getLoggedInUserData } from "../../redux/features/userId/userDataSlice";
import { ThreeDots } from "react-loader-spinner";

function Main() {
    const placeHolderImgUrl = "/images/placeholder.png";

    const [modalToggle, setModalToggle] = useState(false);
    const [imgUrl, setImgUrl] = useState(placeHolderImgUrl);
    const [creatorName, setCreatorName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicError, setProfilePicError] = useState("");
    const [loading, setLoadingState] = useState(false);

    const dispatch = useDispatch();

    const toggleModal = () => {
        setModalToggle(!modalToggle);
    };

    const closeUploader = () => {
        setModalToggle(false);
    };

    const uploadImage = () => {
        setLoadingState(true);
        setProfilePicError("");

        const file = document.getElementById("profile-pic-file").files[0];
        const formData = new FormData();
        formData.append("file", file);

        if (!file) {
            setProfilePicError("Please choose a valid picture!");
            setLoadingState(false);
            console.log("error in uploading image");
            return;
        }

        fetch("/profileImgUpload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                setProfilePicError("");
                setImgUrl(res.img_url);
                setLoadingState(false);
            });
    };

    useEffect(() => {
        fetch("/api/creator-data")
            .then((result) => result.json())
            .then((result) => {
                dispatch(getLoggedInUserData(result.userData));
                const creatorFullName =
                    result.userData.first_name +
                    " " +
                    result.userData.last_name;
                setCreatorName(creatorFullName);
                if (result.userData) {
                    setBio(result.userData.bio);
                }

                if (result.userData.img_url) {
                    setImgUrl(result.userData.img_url);
                }
            });
    }, [imgUrl, bio]);

    return (
        <>
            <div className="main">
                <NavBar openModalHandler={toggleModal} imgUrlHandler={imgUrl} />
                <Routes>
                    <Route path="/mycollabs" element={<MyCollabs />}></Route>
                    <Route path="/" element={<FindCreators />}></Route>
                    <Route
                        path="/creators/:id"
                        element={<OtherCreatorProfile />}
                    ></Route>
                    <Route exact path="/wall" element={<WallFeed />}></Route>
                    <Route path="/chat" element={<Chat />}></Route>

                    <Route path="/online" element={<OnlineCreators />}></Route>
                    <Route
                        path="/collabspaces"
                        element={<CollabSpaces />}
                    ></Route>
                    <Route
                        path="/collabspaces/ai"
                        element={<AiSpace />}
                    ></Route>
                </Routes>

                {modalToggle && (
                    <>
                        {profilePicError != "" && (
                            <p className="profile-pic-error">
                                {profilePicError}
                            </p>
                        )}

                        <Profile
                            closeModalHandler={closeUploader}
                            uploadImgHandler={uploadImage}
                            imgUrlHandler={imgUrl}
                            creatorNameHandler={creatorName}
                            bioHandler={bio}
                        ></Profile>
                        {loading && (
                            <div className="loading-spinner-profile">
                                <ThreeDots
                                    height="100"
                                    width="100"
                                    radius="9"
                                    color="var(--accentColor)"
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                />
                            </div>
                        )}
                    </>
                )}

                <VisitorApi />
            </div>
            {/* <Footer /> */}
        </>
    );
}
export default Main;
