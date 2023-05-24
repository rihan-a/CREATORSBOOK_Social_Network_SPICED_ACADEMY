// require express router
const express = require("express");
const router = express.Router();

// import OpenAi modules ----------------------------->
const { Configuration, OpenAIApi } = require("openai");

// import secrete data from dotenv
const {
    OPENAI_API_KEY,
    OPENAI_ORGANIZATION
} = process.env;

// import funciton from db script to interact with the database tables --------->
const { getAiCount, insertPrompt } = require("../db");


// AI COLLAB-SPACE end-Point using OpenAi for text to Img prompts--------------------------------------->
//------------------------------------------------------------------------------------------------------>
//GET
const configuration = new Configuration({
    organization: `${OPENAI_ORGANIZATION}`,
    apiKey: `${OPENAI_API_KEY}`
});
const openai = new OpenAIApi(configuration);



router.post("/api/collabspace/ai", (req, res) => {
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
router.get("/api/ai/count", (req, res) => {
    let creator_id = req.session.userID;
    getAiCount(creator_id).then((count) => {
        return res.json({
            count: count
        });
    }).catch((err) => console.log(err));
});


module.exports = router;