// require express router
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

// import funciton from db script to interact with the database tables --------->
const {
    createUser,
    getCreatorByEmail,
} = require("./db");


// Registration Route start ---------------------------------------------------->;
//------------------------------------------------------------------------------>
//POST
router.post("/register", (req, res) => {
    //read data sent by the user in the form!
    const { firstName, lastName, email, password } = req.body;

    if (firstName == undefined || lastName == undefined || email == undefined || password == undefined ||
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
                error: "This email is already registered!",
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
                console.log(firstName + " " + lastName);
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



module.exports = router;