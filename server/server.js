const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
require("dotenv").config();
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);

const { sendCodeEmail } = require("./ses");

const cryptoRandomString = require('crypto-random-string');

const aws = require("aws-sdk");
const fs = require("fs");
const { uploader } = require("./middleware");

// import secrete data from dotenv
const { PORT = 3001,
    SESSION_SECRET,
    AWS_KEY,
    AWS_SECRET
} = process.env;

// AWS Mail Setup

// AWS S3
const s3 = new aws.S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});




// Middlewares -------------------------------------------------->
//--------------------------------------------------------------->
app.use(cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 14,
})
);

app.use(express.json());
app.use(compression());
// install middleware to help us read cookies easily
app.use(cookieParser());
// install middleware to help us read POST body (form data) easily
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.static(path.join(__dirname, "uploads")));
//--------------------------------------------------------------->
//--------------------------------------------------------------->

// import funciton from db script to interact with the database tables --------->
const {
    createUser,
    getCreatorById,
    getCreatorByEmail,
    addResetCode,
    verifyResetCode,
    updatePasswordByEmail,
    saveProfileImg,
    saveProfileBio,
    getCreators,
    getCreatorsByName,
    collaborations,
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


// Registration Route start ---------------------------------------------------->
//------------------------------------------------------------------------------>
//POST
app.post("/register", (req, res) => {
    //read data sent by the user in the form!
    console.log(req.body);
    const { firstName, lastName, email, password } = req.body;


    // return res.json({ successo: true });

    if (
        firstName.trim() == "" ||
        lastName.trim() == "" ||
        email.trim() == "" ||
        password.trim() == ""
    ) {
        return res.json({
            error: "Something went wrong, please fill your data properly!"
        });

    }

    // check if the user email is already exsiting -------------------------
    getCreatorByEmail(email).then((user) => {
        //console.log({ user });

        if (user) {
            return res.json({
                error: "this email is already registered!",
            });

        }

        // Hashing password before saving it to data base -----------------
        const hashedPassword = bcrypt.hashSync(password, salt);
        // -----------------------------------------------------------------

        let now = new Date();
        // create a new profile --------------------------------------------
        createUser({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            createdAt: now,
        })
            .then((result) => {
                //console.log("created profile", result);
                req.session.userID = result.id;
                req.session.userName = { firstName, lastName, email };
                req.session.logedIn = true;
                return res.json({ success: true });
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

// Log-In Route ------------------------------------------------------------>
//-------------------------------------------------------------------------->
//POST
app.post("/login", (req, res) => {
    //read data sent by the user in the form!
    const { email, password } = req.body;

    if (email.trim() !== "" || password.trim() !== "") {
        getCreatorByEmail(email).then((user) => {
            //console.log(user);
            if (user) {
                let id = user.id;
                if (bcrypt.compareSync(password, user.password)) {
                    console.log("valid user.....");
                    let firstname = user.first_name;
                    let lastname = user.last_name;
                    let email = user.email;


                    console.log(id);

                    req.session.userID = id;

                    console.log(req.session.userID);

                    req.session.userName = { firstname, lastname, email };

                    req.session.logedIn = true;
                    return res.json({ success: true });

                } else {
                    res.json({
                        error: "invalid password!",
                        success: false
                    });
                }
            } else {
                res.json({
                    error: "invalid email!",
                    success: false
                });
            }
        });
    } else {
        res.json({
            error: "invalid email or password!",
            success: false
        });
    }
});


// Reset password Route ------------------------------------------------------------>
//-------------------------------------------------------------------------->
//POST
app.post("/password/reset/start", (req, res) => {

    const { email } = req.body;

    if (email.trim() !== "") {
        getCreatorByEmail(email).then((result) => {
            if (result) {
                //console.log(result);
                const secretCode = cryptoRandomString({
                    length: 6
                });

                console.log(secretCode);

                let username = result.first_name + " " + result.last_name;
                // generate reset code

                sendCodeEmail(username, secretCode);

                addResetCode({ email: email, reset_code: secretCode }).then((result) => {
                    //console.log(result);
                    return res.json({ success: true });
                });
            } else {
                return res.json({
                    error: "email doesn't exist",
                    success: false
                });
            }
        });
    } else {
        return res.json({
            error: "invalid email!",
            success: false
        });
    }

});

app.post("/password/reset/verify", (req, res) => {

    const { reset_code, password, email } = req.body;

    //console.log(req.body);

    verifyResetCode({ email, reset_code }).then((result) => {
        console.log("verify", result);
        if (result.rowCount > 0) {
            // Add Hashed password to database users table
            const hashedPassword = bcrypt.hashSync(password, salt);
            updatePasswordByEmail({ password: hashedPassword, email: email }).then((results) => { }).catch((err) => {
                console.log(err);
                return res.json({
                    error: "Something went wrong!",
                    success: false
                });
            });
            return res.json({ success: true });
        } else {
            return res.json({
                error: "Wrong or expired reset code",
                success: false
            });
        }

    });

});


// Upload profile picture Route -------------------------------------------->
//-------------------------------------------------------------------------->
//POST
app.post("/profileImgUpload", uploader.single("file"), (req, res) => {
    console.log(req.file);
    const { filename, mimetype, size, path } = req.file;

    const promise = s3 // this to send to aws, different for other cloud storage
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

            let id = req.session.userID;
            let img_url = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

            //call a function to save picture to db 
            saveProfileImg({ id, img_url }).then(() => {
                //console.log(result);
                return res.json({
                    img_url: img_url,
                    success: true
                });
            });

        })
        .catch((err) => {
            console.log(err);
        });
});



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
                userData: userData
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
            return res.json({
                success: true,
                creatorsData: creatorsData
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
        if (creatorsData) {
            return res.json({
                success: true,
                creatorsData: creatorsData
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
                console.log("same user");
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

    console.log(collabState);
    console.log(userId);
    console.log(recipientId);

    collaborations(userId, recipientId, collabState).then((result) => {
        console.log("collab status", result);

        if (result[0]) {
            console.log(result[0].sender_id);
            console.log("there could be a collab");

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
            console.log("no collab");
            return res.json({
                collaborating: false,
            });
        }
    });
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

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
