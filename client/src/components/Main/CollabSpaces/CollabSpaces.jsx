import WhiteBoard from "./Board/WhiteBoard";
import CollabUser from "./CollabUser/CollabUser";
import { useSelector } from "react-redux";

import "./CollabSpaces.css";

function CollabSpaces() {
    const loggedInUser = useSelector((state) => {
        return state.loggedInUserData.userData;
    });

    const otherUserData = useSelector((state) => {
        return state.loggedInUserData.otherUserData;
    });

    return (
        <div className="collab-spaces-wrapper">
            <h2>Real-time Collaborative sketching space</h2>
            <div className="collab-spaces-container">
                {otherUserData.first_name ? (
                    <CollabUser
                        firstName={otherUserData.first_name}
                        lastName={otherUserData.last_name}
                        img={otherUserData.img_url}
                        other={true}
                    />
                ) : (
                    <div className="creator-side"></div>
                )}

                <WhiteBoard />

                <CollabUser
                    firstName={loggedInUser.first_name}
                    lastName={loggedInUser.last_name}
                    img={loggedInUser.img_url}
                />
            </div>
        </div>
    );
}

export default CollabSpaces;
