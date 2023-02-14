// require express router
const express = require("express");
const router = express.Router();


// import funciton from db script to interact with the database tables --------->
const { getCreatorById, saveProfileBio } = require("../db");

// Get all Creators data Route ---------------------------------------------->
//-------------------------------------------------------------------------->
//GET
router.get("/api/creator-data", (req, res) => {
    let id = req.session.userID;
    console.log(id);
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
router.post("/bio/save", (req, res) => {
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


module.exports = router;