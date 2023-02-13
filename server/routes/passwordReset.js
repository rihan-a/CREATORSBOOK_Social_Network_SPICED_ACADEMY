// require express router
const express = require("express");
const router = express.Router();
const path = require("path");
const compression = require("compression");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const { sendCodeEmail } = require("../ses");
const cryptoRandomString = require('crypto-random-string');

// import funciton from db script to interact with the database tables --------->
const {
    getCreatorByEmail,
    addResetCode,
    verifyResetCode,
    updatePasswordByEmail
} = require("../db");



// json parser
router.use(express.json());
router.use(compression());

router.use(express.static(path.join(__dirname, "..", "client", "public")));
router.use(express.static(path.join(__dirname, "uploads")));

// Reset password Route ------------------------------------------------------------>
//-------------------------------------------------------------------------->
//POST
router.post("/password/reset/start", (req, res) => {

    const { email } = req.body;

    if (email.trim() !== "") {
        getCreatorByEmail(email).then((result) => {
            if (result) {
                //console.log(result);
                // generate reset code
                const secretCode = cryptoRandomString({
                    length: 6
                });

                console.log(secretCode);
                let username = result.first_name + " " + result.last_name;

                sendCodeEmail(username, secretCode);
                addResetCode({ email: email, reset_code: secretCode }).then(() => {
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

router.post("/password/reset/verify", (req, res) => {

    const { reset_code, password, email } = req.body;

    //console.log(req.body);
    verifyResetCode({ email, reset_code }).then((result) => {
        //console.log("verify", result);
        if (result.rowCount > 0) {
            // Add Hashed password to database users table
            const hashedPassword = bcrypt.hashSync(password, salt);
            updatePasswordByEmail({ password: hashedPassword, email: email }).then(() => { }).catch((err) => {
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

module.exports = router;