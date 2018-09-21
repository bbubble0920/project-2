// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var aws = require("aws-sdk");
var bodyparser = require("body-parser");
var multer = require("multer");
var multerS3 = require("multer-s3");
require("dotenv").config();
var router = express.Router();

var s3 = new aws.S3();

//define the file filter function
var fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG and/or PNG is allowed!'), false);
    }
};

router.use(bodyparser.json());

var upload = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET,
        acl: 'public-read',
        contentType: function (req, file, cb) {
            cb(null, file.mimetype);
        }, //'image/png',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname); //use Date.now() for unique file keys
        }
    })
});

// Routes
router.get("/artistpage", function (req, res) {
    res.render("artistpage");
});

router.get('/artistUpdate', function (req, res) {
    res.sendFile(__dirname + '../views/artistpage.html');
})


//used by upload form
router.post('/upload', upload.array('upl', 1), function (req, res, next) {
    //res.send("Uploaded!");
    res.render("uploaded");
});

module.exports = router;