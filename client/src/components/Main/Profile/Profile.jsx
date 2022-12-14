import ImageUploader from "./ImageUploader";
import BioEditor from "./BioEditor/BioEditor";
import Logout from "../NavBar/Logout";
import { useState } from "react";

import "./Profile.css";

function Profile(props) {
    const [modalToggle, setModalToggle] = useState(false);

    const toggleModal = () => {
        setModalToggle(!modalToggle);
    };

    return (
        <div className="profile">
            <div
                className="modal-background"
                onClick={props.closeModalHandler}
            ></div>
            <div className="profileModal">
                <h4>
                    {props.firstNameHandler} {props.lastNameHandler}
                </h4>
                <span
                    className="material-symbols-outlined close-icon"
                    onClick={props.closeModalHandler}
                >
                    close
                </span>
                <div className="profile-picture-uploader">
                    <img src={props.imgUrlHandler} alt="" />

                    <span className="edit-icon" onClick={toggleModal}>
                        Upload Profile Picture
                    </span>
                </div>
                {modalToggle == true && (
                    <ImageUploader
                        uploadImgHandler={props.uploadImgHandler}
                        closeUploadModal={toggleModal}
                    />
                )}

                <BioEditor bioHandler={props.bioHandler} />

                <Logout />
            </div>
        </div>
    );
}
export default Profile;
