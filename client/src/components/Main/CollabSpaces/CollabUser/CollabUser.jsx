import { useState } from "react";
import "./CollabUser.css";
import { socket } from "../../../../../src/socket";

function CollabUser(props) {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // on key down enter

    const sendMsgHandler = () => {
        socket.emit("CollabSpaceMessage", message.trim());
        setMessage("");
    };

    const onKeyDown = (e) => {
        if (e.code === "Enter") {
            e.preventDefault();
            socket.emit("CollabSpaceMessage", message.trim());
            setMessage("");
        }
    };

    const onMessageChange = (e) => {
        setMessage(e.target.value);
    };
    return (
        <>
            <div className="creator-side" id={props.other ? "other" : "user"}>
                <div className="profile-pic">
                    <img
                        src={props.img ? props.img : "/images/placeholder.png"}
                        alt=""
                    />
                </div>
                <div className="creator-name">
                    {props.firstName} {props.lastName}
                </div>
                <div className="text-area-container">
                    <div className="wrapper">
                        <textarea
                            name="message"
                            placeholder="Write your message here... "
                            onKeyDown={(e) => onKeyDown(e)}
                            onChange={(e) => onMessageChange(e)}
                            value={message}
                        ></textarea>
                        <button onClick={sendMsgHandler}>Send</button>
                    </div>
                </div>
                <span className="error">{error}</span>
            </div>
        </>
    );
}
export default CollabUser;
