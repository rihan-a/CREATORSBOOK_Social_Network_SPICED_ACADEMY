import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./CollabButton.css";
import {
    deleteCollab,
    acceptCollab,
} from "../../../../redux/features/collabs/collabsSlice";

function CollabButton({ id }) {
    const [collabState, setCollabState] = useState("check");
    const [btnState, setBtnState] = useState("");

    const dispatch = useDispatch();

    //dispatch(getCollabs(result.myCollabsData));

    const handleRejectCollab = () => {
        console.log("decline collab");
        setCollabState("cancel");
        //dispatch(deleteCollab(id));
    };

    const handleCancelCollabReq = () => {
        console.log("cancel collab req");
        setCollabState("cancel");
        //dispatch(deleteCollab(creatorId));
    };

    const handleAcceptCollab = () => {
        console.log("accept state");
        setCollabState("accept");
        //dispatch(acceptCollab(id));
    };

    const handleEndCollab = () => {
        setCollabState("end");
        // dispatch(deleteCollab(creatorId));
    };

    useEffect(() => {
        console.log("state change", collabState);
        fetch(`/collab/${collabState}/${id}`)
            .then((result) => result.json())
            .then((result) => {
                //console.log(result.accepted);
                //console.log(result);
                if (result.collaborating == true) {
                    if (result.accepted == true) {
                        //  console.log("collab accepted");
                        setBtnState("endBtn");
                    } else {
                        if (result.collaborationType == "sentRequest") {
                            setBtnState("cancelBtn");
                        } else {
                            setBtnState("acceptBtn");
                        }
                    }
                } else {
                    setBtnState("collabBtn");
                }
            });
    }, [collabState]);

    return (
        <>
            {(() => {
                switch (btnState) {
                    case "collabBtn":
                        return (
                            <button
                                className="collab-btn"
                                onClick={() => setCollabState("collab")}
                            >
                                <span className="material-symbols-outlined">
                                    handshake
                                </span>
                                Collab Request
                            </button>
                        );

                    case "cancelBtn":
                        return (
                            <button
                                className="collab-btn"
                                onClick={() => handleCancelCollabReq()}
                            >
                                <span className="material-symbols-outlined">
                                    cancel
                                </span>
                                Cancel Collab Request
                            </button>
                        );

                    case "acceptBtn":
                        return (
                            <>
                                <button
                                    className="collab-btn"
                                    onClick={() => handleAcceptCollab()}
                                >
                                    Accept Collab
                                </button>
                                <button
                                    className="collab-btn"
                                    onClick={() => handleRejectCollab()}
                                >
                                    Reject Collab
                                </button>
                            </>
                        );

                    case "endBtn":
                        return (
                            <button
                                className="collab-btn"
                                onClick={() => handleEndCollab()}
                            >
                                <span className="material-symbols-outlined">
                                    block
                                </span>
                                End Collab
                            </button>
                        );

                    default:
                    //console.log("default stage");
                }
            })()}
        </>
    );
}
export default CollabButton;
