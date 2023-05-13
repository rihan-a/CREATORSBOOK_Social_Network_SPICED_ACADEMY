// require express router
const express = require("express");
const router = express.Router();

const {
    S3
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const { uploader } = require("../middleware");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);


// import funciton from db script to interact with the database tables --------->
const { getPostsData, savePostData, getLastPostById } = require("../db");


// import secrete data from dotenv
const { AWS_KEY,
    AWS_SECRET,
} = process.env;


// AWS S3
const s3 = new S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});




// Get posts Data Route ---------------------------------------------------->
//-------------------------------------------------------------------------->
//GET
router.get("/api/posts", (req, res) => {
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





// Upload Post Img to AWS and save url and img data to db Route ------------>
//-------------------------------------------------------------------------->
//POST
router.post("/api/postImgUpload", uploader.single("file"), (req, res) => {
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
        });

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



module.exports = router;