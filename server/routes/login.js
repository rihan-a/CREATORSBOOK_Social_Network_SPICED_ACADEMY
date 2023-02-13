// require express router
const express = require("express");
const router = express.Router();
const path = require("path");
const compression = require("compression");
const bcrypt = require("bcryptjs");


// import funciton from db script to interact with the database tables --------->
const { getCreatorByEmail } = require("../db");


// json parser
router.use(express.json());
router.use(compression());
router.use(express.static(path.join(__dirname, "..", "client", "public")));
router.use(express.static(path.join(__dirname, "uploads")));

// Log-In Route ------------------------------------------------------------>
//-------------------------------------------------------------------------->
//POST
router.post("/login", (req, res) => {
    //read data sent by the user in the form!
    const { email, password } = req.body;

    if (email == undefined || password == undefined || email.trim() !== "" || password.trim() !== "") {
        getCreatorByEmail(email).then((user) => {
            //console.log(user);
            if (user) {
                let id = user.id;
                if (bcrypt.compareSync(password, user.password)) {
                    console.log("valid user.....");
                    let firstname = user.first_name;
                    let lastname = user.last_name;
                    let email = user.email;
                    console.log(firstname + " " + lastname);
                    req.session.userID = id;
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

module.exports = router;