import NavBar from "./NavBar/NavBar";
import Profile from "./Profile/Profile";
import FindCreators from "./FindCreators";
import MyNetwork from "./MyNetwork";
import OtherCreatorProfile from "./OtherCreatorProfile/OtherCreatorProfile";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Main() {
    const placeHolderImgUrl = "/images/placeholder.png";

    const [modalToggle, setModalToggle] = useState(false);

    const [imgUrl, setImgUrl] = useState(placeHolderImgUrl);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");

    const [error, setError] = useState("");

    const toggleModal = () => {
        setModalToggle(!modalToggle);
    };

    const closeUploader = () => {
        setModalToggle(false);
    };

    const uploadImage = () => {
        console.log("user trying to upload an img");

        const file = document.querySelector("input[type=file]").files[0];
        const formData = new FormData();
        formData.append("file", file);

        if (!file) {
            setError("Something went wrong!");
            return;
        }

        fetch("/profileImgUpload", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((res) => {
                //console.log("img url should be here", res);
                setError("");
                setImgUrl(res.img_url);
            });
    };

    useEffect(() => {
        fetch("/creators-data")
            .then((result) => result.json())
            .then((result) => {
                //console.log(result);
                setFirstName(result.userData.first_name);
                setLastName(result.userData.last_name);

                if (result.userData) {
                    setBio(result.userData.bio);
                }
                setError("");
                if (result.userData.img_url) {
                    //console.log(result.userData.img_url);
                    setImgUrl(result.userData.img_url);
                }
            });
    }, [firstName, lastName, imgUrl, bio]);

    return (
        <div className="main">
            <BrowserRouter>
                <NavBar openModalHandler={toggleModal} imgUrlHandler={imgUrl} />

                {modalToggle == true && (
                    <Profile
                        closeModalHandler={closeUploader}
                        uploadImgHandler={uploadImage}
                        imgUrlHandler={imgUrl}
                        firstNameHandler={firstName}
                        lastNameHandler={lastName}
                        errorHandler={error}
                        bioHandler={bio}
                    />
                )}

                <Routes>
                    <Route path="/mynetwork" element={<MyNetwork />}></Route>
                    <Route path="/creators" element={<FindCreators />}></Route>
                    <Route
                        path="/creators/:id"
                        element={<OtherCreatorProfile />}
                    ></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
export default Main;
