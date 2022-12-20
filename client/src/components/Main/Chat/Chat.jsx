import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { activateNavBar } from "../../../redux/features/navBar/navBarSlice";
import { socket } from "../../../socket";
import "./Chat.css";

function Chat() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // on key down enter

    const sendMsgHandler = () => {
        socket.emit("chatMessage", message.trim());
        setMessage("");
    };

    const onKeyDown = (e) => {
        if (e.code === "Enter") {
            e.preventDefault();
            socket.emit("chatMessage", message.trim());
            setMessage("");
        }
    };

    const onMessageChange = (e) => {
        setMessage(e.target.value);
    };

    socket.on("error", (err) => {
        setError(err);
    });

    const messagesList = useSelector((state) => {
        return state.messages.chatMessages && state.messages.chatMessages;
    });

    //console.log("messages", messagesList);

    //highlight nav-bar link when the component get mounted
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(activateNavBar("chat"));
        return function deactivateNavBar() {
            dispatch(activateNavBar(""));
        };
    }, []);

    const loggedInUserId = useSelector((state) => {
        return state.loggedInUserData.userData.id;
    });

    console.log(loggedInUserId);

    return (
        <div className="chat-main-container">
            <ul className="msgs-container">
                {messagesList?.map((message) => (
                    <li
                        key={message.id}
                        className={
                            loggedInUserId == message.sender_id
                                ? "msg-card msg-card-reversed"
                                : "msg-card "
                        }
                    >
                        <div className="chat-profile-pic">
                            <img
                                src={
                                    message.img_url
                                        ? message.img_url
                                        : "/images/placeholder.png"
                                }
                                alt="profile picture"
                            />
                        </div>

                        <div
                            className={
                                loggedInUserId == message.sender_id
                                    ? "chat-name-msg user-chat-bg"
                                    : "chat-name-msg"
                            }
                        >
                            <div className="chat-name-time">
                                <p>
                                    {message.first_name +
                                        " " +
                                        message.last_name}
                                </p>
                                <span>{message.created_at}</span>
                            </div>

                            <p className="message-txt" id={message.sender_id}>
                                {message.message}
                            </p>
                        </div>
                        <div className="empty-dev"></div>
                    </li>
                ))}
            </ul>

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
    );
}

export default Chat;
