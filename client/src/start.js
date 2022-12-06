import { createRoot } from "react-dom/client";
import Welcome from "./components/Welcome/Welcome";
import Main from "./components/Main/Main";

const root = createRoot(document.querySelector("main"));

fetch("/user/id")
    .then((response) => response.json())
    .then((data) => {
        // the userId comes from the session on the server!
        // this means: the user is currently signed in!
        if (data.userID) {
            root.render(<Main />);
        } else {
            root.render(<Welcome />);
        }
    });