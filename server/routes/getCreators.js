// require express router
const express = require("express");
const router = express.Router();


// import funciton from db script to interact with the database tables --------->
const { getCreatorById, getCreators, getCreatorsByName } = require("../db");






// Get lastest 6 creators  Route ------------------------------------------->
//-------------------------------------------------------------------------->
//GET
router.get("/api/creators", (req, res) => {

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
router.get("/api/creators/:searchQuery", (req, res) => {
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
router.get("/api/creator-profile/:id", (req, res) => {

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



module.exports = router;