// require express router
const express = require("express");
const router = express.Router();
const path = require("path");
const compression = require("compression");
const {
    S3
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const { uploader } = require("../middleware");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);


// import funciton from db script to interact with the database tables --------->
const { saveProfileImg } = require("../db");


// json parser
router.use(express.json());
router.use(compression());
router.use(express.static(path.join(__dirname, "..", "client", "public")));
router.use(express.static(path.join(__dirname, "uploads")));


// import secrete data from dotenv
const { AWS_KEY,
    AWS_SECRET,
} = process.env;


// AWS S3
const s3 = new S3({
    accessKeyId: AWS_KEY,
    secretAccessKey: AWS_SECRET,
});



// Upload profile picture Route -------------------------------------------->
//-------------------------------------------------------------------------->
//POST
router.post("/profileImgUpload", uploader.single("file"), (req, res) => {
    //console.log(req.file);
    const { filename, mimetype, size, path } = req.file;
    const promise = s3 // this to send to aws, different for other cloud storage
        .putObject({
            Bucket: "rihanbucket/creatorsbook-profile-pic",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        });
    promise
        .then(() => {
            let id = req.session.userID;
            let img_url = `https://s3.amazonaws.com/rihanbucket/creatorsbook-profile-pic/${req.file.filename}`;
            //call a function to save picture to db 
            saveProfileImg({ id, img_url }).then(() => {
                //console.log(result);
                return res.json({
                    img_url: img_url,
                    success: true
                });
            });
            // Delete image from local storage
            unlinkFile(req.file.path);
        })
        .catch((err) => {
            console.log(err);
        });
});


module.exports = router;