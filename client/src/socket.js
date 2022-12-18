import { io } from "socket.io-client";
import {
    chatMessageReceived, chatMessagesReceived
} from "./redux/features/chat/chatSlice";

import { online, offline } from "./redux/features/onlineCreators/onlineCreatorsSlice";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on(
            'chatMessages',
            msgs => {
                if (msgs) {
                    store.dispatch(
                        chatMessagesReceived(msgs)
                    );
                }
            }
        );
        socket.on(
            'chatMessage',
            msg => store.dispatch(
                chatMessageReceived(msg)
            )
        );

        //  online - creators 
        socket.on('onlineCreatorsList', (creators) => {
            //console.log('creator online', creators);
            store.dispatch(online(creators));
        });

        socket.on('offlineCreator', (creator) => {
            //console.log('creator offline', creator);
            store.dispatch(offline(creator));
        });

    }
};
