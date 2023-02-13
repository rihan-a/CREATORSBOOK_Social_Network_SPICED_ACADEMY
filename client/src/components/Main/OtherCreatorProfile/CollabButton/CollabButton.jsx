import { useState, useEffect } from "react";
import "./CollabButton.css";

function CollabButton({ id }) {
    const [collabState, setCollabState] = useState("check");
    const [btnState, setBtnState] = useState("");

    const handleRejectCollab = () => {
        console.log("decline collab");
        setCollabState("cancel");
    };

    const handleCancelCollabReq = () => {
        console.log("cancel collab req");
        setCollabState("cancel");
    };

    const handleAcceptCollab = () => {
        console.log("accept state");
        setCollabState("accept");
    };

    const handleEndCollab = () => {
        setCollabState("end");
    };

    useEffect(() => {
        fetch(`/collab/${collabState}/${id}`)
            .then((result) => result.json())
            .then((result) => {
                if (result.collaborating == true) {
                    if (result.accepted == true) {
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
                }
            })()}
        </>
    );
}
export default CollabButton;
