import { useState, useEffect } from "react";
import "./CollabButton.css";

function CollabButton({ id }) {
    const [collabState, setCollabState] = useState("check");
    const [btnState, setBtnState] = useState("");

    useEffect(() => {
        console.log(id);
        fetch(`/collab/${collabState}/${id}`)
            .then((result) => result.json())
            .then((result) => {
                //console.log(result);
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
                                Collab
                            </button>
                        );

                    case "cancelBtn":
                        return (
                            <button
                                className="collab-btn"
                                onClick={() => setCollabState("cancel")}
                            >
                                Cancel Collab request
                            </button>
                        );

                    case "acceptBtn":
                        return (
                            <>
                                <button
                                    className="collab-btn"
                                    onClick={() => setCollabState("accept")}
                                >
                                    Accept Collab
                                </button>
                                <button
                                    className="collab-btn"
                                    onClick={() => setCollabState("cancel")}
                                >
                                    Reject Collab
                                </button>
                            </>
                        );

                    case "endBtn":
                        return (
                            <button
                                className="collab-btn"
                                onClick={() => setCollabState("end")}
                            >
                                End Collab
                            </button>
                        );

                    default:
                        console.log("default stage");
                }
            })()}
        </>
    );
}
export default CollabButton;
