// require express router
const express = require("express");
const router = express.Router();


// import funciton from db script to interact with the database tables --------->
const { collaborations, getPossibleCollabs } = require("../db");



// Collab Route ------------------------------------------------------------>
//-------------------------------------------------------------------------->
//GET
router.get("/collab/:collabstate/:recipientId", (req, res) => {
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
router.get("/api/mycollabs", (req, res) => {
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



module.exports = router;