// REQUIRE NODE MODULES 
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
require("dotenv").config();
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");


// import secrete data from dotenv
const { PORT = 3001,
    SESSION_SECRET,
} = process.env;

const server = require("http").Server(app);

const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    samesite: true,
});


const io = require("socket.io")(server, {
    cors: {
        origin: ["https://creatorsbook.de"],
        credentials: true,
    }
});


io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});


// Middlewares -------------------------------------------------->
//--------------------------------------------------------------->
app.use(cookieSessionMiddleware);
app.use(express.json());
app.use(compression());
// install middleware to help us read cookies easily
app.use(cookieParser());
// install middleware to help us read POST body (form data) easily
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));
//------------------------------------------------------------------------------>
//------------------------------------------------------------------------------>

// import funciton from db script to interact with the database tables --------->
const {
    getCreatorsByIds,
    insertMessage,
    getMessages,
    getLastMessageById,
    getAiCount
} = require("./db");



//check if user loged in start ------------------------------------------------->
//------------------------------------------------------------------------------>
//GET
app.get("/user/id", (req, res) => {
    if (req.session.userID) {
        res.status(200).json({ userID: req.session.userID });
    } else {
        res.status(401).json({ userID: null });
    }

});


// import registeration route
const registration = require("./routes/registration");
app.use(registration);

// import login route
const login = require("./routes/login");
app.use(login);

// import password reset route
const passwordReset = require("./routes/passwordReset");
app.use(passwordReset);

// import profile picture upload route
const profilePicUpload = require("./routes/profilePicUpload");
app.use(profilePicUpload);

// import logged In Creator route
const loggedInCreator = require("./routes/loggedInCreator");
app.use(loggedInCreator);

// import get Creators route
const getCreators = require("./routes/getCreators");
app.use(getCreators);

// import collabs route
const collabs = require("./routes/collabs");
app.use(collabs);

// import posts route
const posts = require("./routes/posts");
app.use(posts);

// import collab Space AI route
const collabSpaceAI = require("./routes/collabSpaceAI");
app.use(collabSpaceAI);



// Get Visitors Api Route ---------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.post("/visitorapi", (req) => {
    const { firstname, lastname } = req.session.userName;
    const visitorData = req.body;
    // log visitor data
    console.log(firstname + " " + lastname, visitorData);
});

// SOCKET IO CHAT ---------------------------------------------------------->
//-------------------------------------------------------------------------->
const onlineCreators = {};
io.on("connection", async (socket) => {
    console.log("incoming socket connection >>>>>>>>>>>>>>>", socket.id);

    const { userID } = socket.request.session;

    if (!userID) {
        return socket.disconnect(true);
    }


    //get the latest 10 messages
    getMessages().then((results) => {
        //console.log(results);
        socket.emit("chatMessages", results);
    });

    // listen for when the connected user sends a message
    socket.on("chatMessage", (message) => {
        //console.log(message);
        if (message.trim() !== "") {
            insertMessage({ sender_id: userID, message }).then((newMsg) => {
                //console.log("new message", newMsg[0]);
                // get last msg full data - creators name - img-url 
                getLastMessageById({ id: newMsg[0].id }).then((newMsgFullData) => {
                    //console.log("new message with fulldata", newMsgFullData);
                    io.emit("chatMessage", newMsgFullData[0]);
                });
            }).catch((err) => {
                console.log("there is an error :/", err);
            });
        } else {
            io.emit("error", "Message can't be empty!");
        }
    });

    // -------------- ONLINE --------------
    //-------------------------------------
    //console.log(userID, "connected");

    // store connected creators userId and socket Id
    onlineCreators[userID] = socket.id;

    //console.log(onlineCreators);

    // extract user Ids keys and convert them to numbers
    let ids = Object.keys(onlineCreators).map(Number);

    //console.log("ids", ids);

    // get multiple Creators by Ids from db
    getCreatorsByIds(ids).then((results) => {
        //console.log("users", results);
        io.emit("onlineCreatorsList", results);
    });

    // ON DISCONNECT ------------------------------------------------------->
    socket.on("disconnect", () => {
        // remove diconnected user from the onlineCreators list
        for (const [key, value] of Object.entries(onlineCreators)) {
            //console.log(`${key}: ${value}`);
            if (socket.id == value) {
                delete onlineCreators[key];
                io.emit("offlineCreator", key);

            }
        }
    });

    // ----- CANVAS -  COLAB SKETCHING  ------------------------------------------->

    socket.on("canvas-data", (data) => {
        socket.broadcast.emit('canvas-data', data);
    });
});







// Get AI prompts count ---------------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("/api/ai/count", (req, res) => {
    let creator_id = req.session.userID;
    getAiCount(creator_id).then((count) => {
        return res.json({
            count: count
        });
    }).catch((err) => console.log(err));
});


// Logout Route ------------------------------------------------------------>
//-------------------------------------------------------------------------->
//GET
app.get("/logout", function (req, res) {
    req.session = null;
    return res.json({ userID: null });
});

// Catch all Route --------------------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});