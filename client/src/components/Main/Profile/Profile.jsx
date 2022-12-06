import ImageUploader from "./ImageUploader";
import BioEditor from "./BioEditor/BioEditor";

import { useState } from "react";

import "./Profile.css";

function Profile(props) {
    const [modalToggle, setModalToggle] = useState(false);

    const toggleModal = () => {
        setModalToggle(!modalToggle);
    };

    return (
        <>
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
                    <span
                        className="material-symbols-outlined edit-icon"
                        onClick={toggleModal}
                    >
                        edit
                    </span>
                </div>
                {modalToggle == true && (
                    <ImageUploader
                        uploadImgHandler={props.uploadImgHandler}
                        closeUploadModal={toggleModal}
                    />
                )}

                <BioEditor bioHandler={props.bioHandler} />
            </div>
        </>
    );
}
export default Profile;
