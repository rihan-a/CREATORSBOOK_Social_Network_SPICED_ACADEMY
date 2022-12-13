import { io } from "socket.io-client";
import {
    chatMessageReceived, chatMessagesReceived
} from "./redux/features/chat/chatSlice";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on(
            'chatMessages',
            msgs => store.dispatch(
                chatMessagesReceived(msgs)
            )
        );

        socket.on(
            'chatMessage',
            msg => store.dispatch(
                chatMessageReceived(msg)
            )
        );
    }
};


