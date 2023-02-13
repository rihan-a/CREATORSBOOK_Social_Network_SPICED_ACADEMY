// REQUIRE NODE MODULES 
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
require("dotenv").config();
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const aws = require("aws-sdk");
const fs = require("fs");
const salt = bcrypt.genSaltSync(10);

const { uploader } = require("./middleware");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);



// import OpenAi modules ----------------------------->
const { Configuration, OpenAIApi } = require("openai");


// import secrete data from dotenv
const { PORT = 3001,
    SESSION_SECRET,
    AWS_KEY,
    AWS_SECRET,
    OPENAI_API_KEY
} = process.env;


// AWS S3
const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});

const server = require("http").Server(app);


const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    samesite: true,
});


const io = require("socket.io")(server, {
    cors: {
        origin: ["https://www.creatorsbook.de"],
        allowedHeaders: ["my-custom-header"],
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
    createUser,
    getCreatorById,
    getCreatorsByIds,
    getCreatorByEmail,
    addResetCode,
    verifyResetCode,
    updatePasswordByEmail,
    saveProfileImg,
    saveProfileBio,
    getCreators,
    getCreatorsByName,
    collaborations,
    getPossibleCollabs,
    insertMessage,
    getMessages,
    getLastMessageById,
    savePostData,
    getPostsData,
    getLastPostById,
    insertPrompt,
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

// import login route
const passwordReset = require("./routes/passwordReset");
app.use(passwordReset);

// import login route
const profilePicUpload = require("./routes/profilePicUpload");
app.use(profilePicUpload);



// Get all Creators data Route ---------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("/creators-data", (req, res) => {
    let id = req.session.userID;
    getCreatorById(id).then((userData) => {
        //console.log(userData);
        if (userData) {
            return res.json({
                success: true,
                userData: userData,
                id: id,
            });

        } else {
            return res.json({
                error: "Something went wrong..",
                success: false

            });
        }
    });
});


// Save Bio data to db Route ---------------------------------------------->
//-------------------------------------------------------------------------->
//POST
app.post("/bio/save", (req, res) => {
    const { bioText } = req.body;

    let id = req.session.userID;
    //console.log(id + " " + bioText);

    saveProfileBio({ id, bio: bioText }).then((result) => {
        //console.log(result.rows[0].bio);
        let bio = result.rows[0].bio;
        return res.json({
            success: true,
            bio: bio
        });

    }).catch((err) => {
        console.log(err);
        return res.json({
            error: "Something went wrong..",
            success: false

        });
    });

});


// Get lastest 6 creators  Route ------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("/api/creators", (req, res) => {

    getCreators().then((creatorsData) => {
        //console.log(userData);
        if (creatorsData) {
            let id = req.session.userID;
            const filteredCreatorsData = creatorsData.filter(creator => creator.id != id);
            return res.json({
                success: true,
                creatorsData: filteredCreatorsData
            });

        } else {
            return res.json({
                error: "Something went wrong..",
                success: false

            });
        }
    });
});

// Get creators by name Route ---------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("/api/creators/:searchQuery", (req, res) => {
    let searchQuery = req.params.searchQuery;
    //console.log(searchQuery);
    getCreatorsByName(searchQuery).then((creatorsData) => {
        //console.log(creatorsData);
        let id = req.session.userID;
        const filteredCreatorsData = creatorsData.filter(creator => creator.id != id);

        if (creatorsData) {
            return res.json({
                success: true,
                creatorsData: filteredCreatorsData
            });

        } else {
            return res.json({
                error: "Something went wrong..",
                success: false

            });
        }
    });
});


// Get creators by ID Route ---------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("/api/creator-profile/:id", (req, res) => {

    let id = req.params.id;
    let userId = req.session.userID;

    getCreatorById(id).then((creatorData) => {
        //console.log(creatorData);
        if (creatorData) {
            if (id == userId) {
                //console.log("same user");
                return res.json({
                    success: true,
                    sameUser: true
                });
            } else {
                return res.json({
                    success: true,
                    creatorData: creatorData,
                });
            }

        } else {
            return res.json({
                error: "Something went wrong..",
                success: false

            });
        }
    });
});


// Collab Route ------------------------------------------------------------>
//-------------------------------------------------------------------------->
//GET
app.get("/collab/:collabstate/:recipientId", (req, res) => {
    let collabState = req.params.collabstate;
    let recipientId = req.params.recipientId;
    let userId = req.session.userID;

    //console.log(collabState);
    //console.log(userId);
    //console.log(recipientId);


    collaborations(userId, recipientId, collabState).then((result) => {
        //console.log("collab status", result);

        if (result[0]) {
            console.log(result[0].sender_id);
            //console.log("there could be a collab");

            if (result[0].sender_id == userId) {
                return res.json({
                    collaborating: true,
                    accepted: result[0].accepted,
                    collaborationType: "sentRequest",
                });
            } else {
                return res.json({
                    collaborating: true,
                    accepted: result[0].accepted,
                    collaborationType: "recievedRequest",
                });
            }

        } else {
            //console.log("no collab");
            return res.json({
                collaborating: false,
            });
        }
    }).catch((err) => {
        console.log("there is an error :/", err);
    });
});




// Get My collabs data Route ---------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("/api/mycollabs", (req, res) => {
    let id = req.session.userID;
    getPossibleCollabs(id).then((results) => {
        //console.log(results);
        return res.json({
            success: true,
            myCollabsData: results,
            myId: id
        });
    });
});

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



// Upload Post Img to AWS and save url and img data to db Route ------------>
//-------------------------------------------------------------------------->
//POST
app.post("/postImgUpload", uploader.single("file"), (req, res) => {
    //console.log(req.file);
    const { postTitle, postDesc } = req.body;
    const { filename, mimetype, size, path } = req.file;

    const promise = s3 // this to send to aws
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            let creator_id = req.session.userID;
            let img_url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

            //call a function to save picture to db 
            savePostData({ url: img_url, creator_id, title: postTitle, desc: postDesc }).then((postData) => {
                //console.log(result);
                let id = postData.id;
                getLastPostById(id).then((postFullData) => {
                    //console.log(postFullData[0]);
                    return res.json({
                        success: true,
                        postData: postFullData[0]
                    });
                }).catch((err) => console.log(err));
            });
            // Delete image from local storage
            unlinkFile(req.file.path);
        })
        .catch((err) => {
            console.log(err);
        });
});

// Get posts Data Route ---------------------------------------------------->
//-------------------------------------------------------------------------->
//GET
app.get("/api/posts", (req, res) => {
    getPostsData().then((postsData) => {
        if (postsData) {
            return res.json({
                success: true,
                postsData: postsData
            });
        } else {
            return res.json({
                success: false,
                error: "no posts yet"
            });
        }
    });
});

// AI COLLAB-SPACE end-Point using OpenAi for text to Img prompts--------------------------------------->
//------------------------------------------------------------------------------------------------------>
//GET
const configuration = new Configuration({
    apiKey: `${OPENAI_API_KEY}`,
});
const openai = new OpenAIApi(configuration);



app.post("/api/collabspace/ai", (req, res) => {
    let creator_id = req.session.userID;
    const { creatorPrompt } = req.body;
    let count = 0;
    // get prompt count
    getAiCount(creator_id).then((result) => {
        if (result) {
            console.log(result);
            count = result.count + 1;
        } else {
            count = 1;
        }
        // insert prompt data into db
        insertPrompt({ count, creator_id, prompt: creatorPrompt }).then((result) => {
            if (result.count < 11) {
                openai.createImage({
                    prompt: creatorPrompt,
                    n: 1,
                    size: "1024x1024",
                }).then((data => {
                    console.log(data.data.data[0].url);
                    return res.json({ url: data.data.data[0].url, count: result.count });
                })).catch(err => { console.log("error is ...", err); });
            } else {
                return res.json({ url: "", count: result.count, error: "you have passed your limit of 10 prompts" });
            }

        }).catch((err) => console.log(err));

    }).catch((err) => console.log(err));


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