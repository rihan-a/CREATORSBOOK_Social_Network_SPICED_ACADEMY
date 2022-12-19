import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import collabsReducer from './features/collabs/collabsSlice';
import chatReducer from './features/chat/chatSlice';
import navBarReducer from './features/navBar/navBarSlice';
import userIdReducer from './features/userId/userIdSlice';
import postsReducer from './features/posts/postsSlice';
import onlineCreatorsReducer from '../redux/features/onlineCreators/onlineCreatorsSlice';
import boardReducer from "./features/board/boardSlice";

const reducer = combineReducers({
    // here we will be adding reducers
    collabs: collabsReducer,
    messages: chatReducer,
    navBarColor: navBarReducer,
    loggedInUserId: userIdReducer,
    posts: postsReducer,
    onlineCreators: onlineCreatorsReducer,
    board: boardReducer,
});
const store = configureStore({
    reducer,
});
export default store;





