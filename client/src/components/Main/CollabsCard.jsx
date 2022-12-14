import { useState } from "react";
import OtherCreatorProfile from "./OtherCreatorProfile/OtherCreatorProfile";

function CollabsCard(props) {
    const [creatorModal, setCreatorModal] = useState(false);

    const creatorModalHandler = () => {
        //console.log("clicked");
        setCreatorModal(!creatorModal);
    };

    return (
        <>
            <div
                className="creator-img-container"
                onClick={creatorModalHandler}
            >
                <img
                    className="creator-img"
                    src={props.imgUrl}
                    id={props.id}
                    alt="profile picture"
                />
            </div>
            <h4 className="creator-name">
                {props.firstName} {props.lastName}
                {props.online && <span className="online-badge"></span>}
            </h4>
            {creatorModal == true && (
                <OtherCreatorProfile
                    creatorId={props.id}
                    closeModalCallBack={creatorModalHandler}
                />
            )}
        </>
    );
}

export default CollabsCard;
