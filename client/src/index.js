import { createRoot } from "react-dom/client";
import Welcome from "./components/Welcome/Welcome";
import Main from "./components/Main/Main";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter } from "react-router-dom";

import { init } from "./socket";

const root = createRoot(document.querySelector("main"));

const checkUserId = async () => {
    try {
        const response = await fetch("/user/id");
        const data = await response.json();
        // the userId comes from the session on the server!
        if (data.userID) {
            // this means: the user is currently signed in!
            init(store);
            root.render(
                <Provider store={store}>
                    <BrowserRouter>
                        <Main />
                    </BrowserRouter>
                </Provider>
            );
        } else {
            root.render(<Welcome />);
        }
    } catch (error) {
        console.log("error", error);
    }
};

checkUserId();