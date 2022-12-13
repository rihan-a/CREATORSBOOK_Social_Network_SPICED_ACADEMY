import { createRoot } from "react-dom/client";
import Welcome from "./components/Welcome/Welcome";
import Main from "./components/Main/Main";
import { Provider } from "react-redux";
import store from "./redux/store";

import { init } from "./socket";


const root = createRoot(document.querySelector("main"));

fetch("/user/id")
    .then((response) => response.json())
    .then((data) => {
        // the userId comes from the session on the server!
        // this means: the user is currently signed in!
        if (data.userID) {
            init(store);
            root.render(
                <Provider store={store}>
                    <Main />
                </Provider>
            );
        } else {
            root.render(<Welcome />);
        }
    });