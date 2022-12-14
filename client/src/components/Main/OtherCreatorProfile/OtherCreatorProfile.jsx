import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import "./OtherCreatorsProfile.css";
import CollabButton from "./CollabButton/CollabButton";

function OtherCreatorProfile(props) {
    const { id } = useParams();
    const clickedId = props.creatorId;
    const [creatorProfile, setCreatorProfile] = useState({});
    let creatorIdToFetch = null;
    const navigate = useNavigate();
    const closeModalHandler = () => {
        props.closeModalCallBack();
    };

    useEffect(() => {
        clickedId ? (creatorIdToFetch = clickedId) : (creatorIdToFetch = id);

        fetch(`/api/creator-profile/${creatorIdToFetch}`)
            .then((creatorData) => creatorData.json())
            .then((creatorData) => {
                if (creatorData.success == true) {
                    if (creatorData.sameUser) {
                        navigate("/");
                    } else {
                        setCreatorProfile(creatorData.creatorData);
                    }
                } else {
                    navigate("/", { replace: true });
                }
            });
    }, [id]);

    //onClick={closeModalHandler}

    return (
        <div>
            <div className="modal-background" onClick={closeModalHandler}></div>
            <div className="creator-modal">
                <div className="creator-modal-img-container">
                    {clickedId ? (
                        <span
                            className="material-symbols-outlined close-icon"
                            onClick={closeModalHandler}
                        >
                            close
                        </span>
                    ) : (
                        <span></span>
                    )}

                    <img
                        className="creator-modal-img"
                        src={
                            creatorProfile.img_url
                                ? creatorProfile.img_url
                                : "/images/placeholder.png"
                        }
                        alt="profile picture"
                    />
                </div>
                <h4 className="creator-name">
                    {creatorProfile.first_name} {creatorProfile.last_name}
                </h4>
                <p className="creator-bio">{creatorProfile.bio}</p>
                <CollabButton id={props.creatorId} />
            </div>
        </div>
    );
}
export default OtherCreatorProfile;
