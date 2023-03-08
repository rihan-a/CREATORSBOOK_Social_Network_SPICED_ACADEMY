import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CollabsCard from "./CollabsCard";
import { Link } from "react-router-dom";

import { activateNavBar } from "../../redux/features/navBar/navBarSlice";
import { getOtherUserData } from "../../redux/features/userId/userDataSlice";

import {
    getCollabs,
    deleteCollab,
    acceptCollab,
} from "../../redux/features/collabs/collabsSlice";

function MyCollabs() {
    // const [error, setError] = useState("");

    const dispatch = useDispatch();

    //highlight nav-bar link when the component get mounted
    useEffect(() => {
        dispatch(activateNavBar("collabs"));
        return function deactivateNavBar() {
            dispatch(activateNavBar(""));
        };
    }, []);

    const handleCollabAction = (id, status) => {
        updateCollabState(id, status);
        if (status == "end" || status == "cancel") dispatch(deleteCollab(id));
        else {
            dispatch(acceptCollab(id));
        }
    };

    // function to update collab status in database
    const updateCollabState = (id, state) => {
        fetch(`/collab/${state}/${id}`)
            .then((result) => result.json())
            .then((result) => {
                console.log(result);
            });
    };

    const onGoingCollabsList = useSelector((state) => {
        return (
            state.collabs.possibleCollabs &&
            state.collabs.possibleCollabs.filter((collab) => collab.accepted)
        );
    });

    const requestedCollabsList = useSelector((state) => {
        // console.log(state);
        return (
            state.collabs.possibleCollabs &&
            state.collabs.possibleCollabs.filter(
                (collab) => !collab.accepted && collab.sender_id != collab.id
            )
        );
    });

    const incomingCollabRequests = useSelector((state) => {
        return (
            state.collabs.possibleCollabs &&
            state.collabs.possibleCollabs.filter(
                (collab) => !collab.accepted && collab.sender_id == collab.id
            )
        );
    });

    const handleOtherUserData = (collab) => {
        dispatch(getOtherUserData(collab));
    };

    useEffect(() => {
        fetch("/api/mycollabs")
            .then((result) => result.json())
            .then((result) => {
                //console.log(result);
                if (result.success == true) {
                    //console.log(result.myCollabsData);
                    dispatch(getCollabs(result.myCollabsData));
                } else {
                    //setError(result.error);
                }
            });
    }, []);

    return (
        <>
            <div className="possible-collabs">
                {onGoingCollabsList.length != 0 && (
                    <h3>My ongoing collabs ({onGoingCollabsList.length})</h3>
                )}
                <div className="creators-container">
                    {onGoingCollabsList.map((collab) => {
                        return (
                            <div
                                className="creator-card"
                                key={collab.id}
                                id={collab.id}
                            >
                                <CollabsCard
                                    key={collab.id}
                                    id={collab.id}
                                    firstName={collab.first_name}
                                    lastName={collab.last_name}
                                    imgUrl={
                                        collab.img_url
                                            ? collab.img_url
                                            : "/images/placeholder.png"
                                    }
                                />
                                <button
                                    className="collab-btn small"
                                    onClick={() =>
                                        handleCollabAction(collab.id, "end")
                                    }
                                >
                                    <span className="material-symbols-outlined">
                                        block
                                    </span>
                                    End Collab
                                </button>

                                <Link
                                    className="collab-btn small link"
                                    to="/collabspaces"
                                    onClick={() => handleOtherUserData(collab)}
                                >
                                    Start a Collab Space
                                    <span className="beta">beta</span>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {requestedCollabsList.length != 0 && (
                    <h3>My collab requests ({requestedCollabsList.length})</h3>
                )}
                <div className="creators-container">
                    {requestedCollabsList.map((collab) => {
                        return (
                            <div
                                className="creator-card"
                                key={collab.id}
                                id={collab.id}
                            >
                                <CollabsCard
                                    key={collab.id}
                                    id={collab.id}
                                    firstName={collab.first_name}
                                    lastName={collab.last_name}
                                    imgUrl={
                                        collab.img_url
                                            ? collab.img_url
                                            : "/images/placeholder.png"
                                    }
                                />
                                <button
                                    className="collab-btn small"
                                    onClick={() =>
                                        handleCollabAction(collab.id, "cancel")
                                    }
                                >
                                    <span className="material-symbols-outlined">
                                        cancel
                                    </span>
                                    Cancel Collab Request
                                </button>
                            </div>
                        );
                    })}
                </div>

                {incomingCollabRequests.length != 0 && (
                    <h3>
                        Incoming collab requests (
                        {incomingCollabRequests.length})
                    </h3>
                )}
                <div className="creators-container">
                    {incomingCollabRequests.map((collab) => {
                        return (
                            <div
                                className="creator-card"
                                key={collab.id}
                                id={collab.id}
                            >
                                <CollabsCard
                                    key={collab.id}
                                    id={collab.id}
                                    firstName={collab.first_name}
                                    lastName={collab.last_name}
                                    imgUrl={
                                        collab.img_url
                                            ? collab.img_url
                                            : "/images/placeholder.png"
                                    }
                                />
                                <button
                                    className="collab-btn small"
                                    onClick={() =>
                                        handleCollabAction(collab.id, "accept")
                                    }
                                >
                                    Accept Collab
                                </button>
                                <button
                                    className="collab-btn small"
                                    onClick={() =>
                                        handleCollabAction(collab.id, "cancel")
                                    }
                                >
                                    Reject Collab
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default MyCollabs;
