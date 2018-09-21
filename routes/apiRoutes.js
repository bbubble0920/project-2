// Dependencies
var express = require("express");
var router = express.Router();
var path = require("path");
var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");

// PassportJS
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

// Sequelize Configuration 
var db = require("../models/index");

// Global Variabels
var name;
var email;
var username;
var password;
var password2;


//aws setup
aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: 'us-east-1'
});
// Create an instance of the express and aws-s3 app.
var s3 = new aws.S3();

// ============================================
// Sessions: Creating Cookies and Reading Them
// ============================================

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (user, done) {
  db.Designer.findAll({
      where: {
          id: user.id
      }
  }).then(function(user) {
      done(null, user);
  });
});


// ==================
// ==================
// HTML ROUTES 
// ==================
// ==================


// ================
// Serve Main Page
// ================
// router.get("/",
//   // passport.authenticate('local'),
//   function (req, res) {
//     console.log("Error retrieving main page");
//     res.render("index");
//   });


// ========================
// Serve Register User Page
// ========================
router.get("/register", function (req, res) {
  res.render("register");
});

router.get("/artistpage", function(req, res) {
  //console.log(req);
  res.render("artistpage");    
});

router.get("/artistUpdate", function (req, res) {
  res.sendFile(path.join(__dirname, "../views/artistpage.html"));
});

//======================================================================
var fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(new Error('Invalid file type, only JPEG and/or PNG is allowed!'), false);
  }
};

//app.use(bodyparser.json());

var upload = multer({
  fileFilter,
  storage: multerS3({
      s3: s3,
      bucket: process.env.BUCKET,
      acl: 'public-read',
      contentType: function (req, file, cb){
          cb(null, file.mimetype);
       }, //'image/png',
      key: function (req, file, cb) {
          console.log(file);
          cb(null, file.originalname); //use Date.now() for unique file keys
      }
  })
});

router.post('/upload', upload.array('upl',1), function (req, res, next) {
  //res.send("Uploaded!");
  res.render("uploaded");
});
// ================
// Artist  Page
// ================
// router.get("/artistpage",
// // passport.authenticate("local-passport"),
// function (req, res) {
//     res.render("artistpage");
//   });

//   router.get("/artistpage/andy",
// // passport.authenticate("local-passport"),
// function (req, res) {
//   res.sendFile(path.join(__dirname, "../views", "artistpage.html"));
//   });

//   router.get("/uploaded",
// // passport.authenticate("local-passport"),
// function (req, res) {
//     res.render("uploaded");
//   });

//   router.get("/artistUpdate",
// // passport.authenticate("local-passport"),
// function (req, res) {
//   res.sendFile(path.join(__dirname, "../views", "artistpage.html"));
//   });
// ================
// Serve Login Page
// ================
router.get("/login",
  // passport.authenticate('local'),
  function (req, res) {
    res.render("login");
  });

// ======================
// Login Authentication
// ======================
router.post("/login",
  passport.authenticate("local", {
    successRedirect: "/apiRoutes/artistpage",
    failureRedirect: "/apiRoutes/login"
  }));


// // ===============================
// // ===============================
// // API ROUTES
// // ===============================
// // ===============================

// =========================
// Register User: (working)
// ========================
router.post("/register", function (req, res) {
  //TESTING
  console.log("\nREGISERTING NEW USER");
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var emailAddress = req.body.emailAddress;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  var phoneNumber = req.body.phoneNumber;
  var designerBio = req.body.designerBio;


  console.log(
    "User Registered: ",
    "\nFirst Name: ", firstName,
    "\nLast Name: ", lastName,
    "\nEmail Address: ", emailAddress,
    "\nUser Name: ", username,
    "\nPassword: ", password,
    "\nConfirmed Password: ", password2,
    "\nPhone Number: ", phoneNumber,
    "\nDesigner Bio: ", designerBio);

  // Validation 
  req.checkBody("firstName", "First name is required").notEmpty();
  req.checkBody("lastName", "Last name is required").notEmpty();
  req.checkBody("emailAddress", "Email is required").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required.").notEmpty();
  req.checkBody("password2", "Passwords do not match.").equals(req.body.password);
  req.checkBody("phoneNumber", "Phone is required.").notEmpty();
  req.checkBody("brandName", "Phone is required.").notEmpty();
  req.checkBody("designerBio", "Bio is required.").notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    console.log("There are errors");
    res.render("register", {
      errors: errors // passalong errors
    });
  } else {

    db.Designer.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      username: req.body.username,
      password: req.body.password,
      password2: req.body.password2,
      phoneNumber: req.body.phoneNumber,
      brandName: req.body.brandName,
      designerBio: req.body.designerBio
    }).then(function () {
      // res.json(result);
      req.flash("success_msg", "You are registered and can now login.");
      res.redirect("/apiRoutes/login");
      console.log("PASSED");

    }).catch(function (err) {
      if (err) {
        console.log("An error has occured. Please check your inputs.", err);
      }
    });
  }
});


// ========================================================
// CONFIGURATION: Username and Password Match Validation
// ========================================================

passport.use(new LocalStrategy(
  function (username, password, done) {
      db.Designer.findOne({
          where: {
              username: username
          }
      }).then(function (user, err) {
          console.log("\nUser has been found... moving on.");
          if (err) {
              console.log("Can't find user.");
              return done(err);
          }
          if (!user) {
              return done(null, false, {
                  message: "Incorrect Username."
              });
          }

          if (!user.validPassword(password)) {
              return done(null, false, {
                  message: "Incorrect Password."
              });
          }
          return done(null, user);
      }).catch(function (err) {
          console.log("Error in authenticating user: ", err);

      });
  }
));

// ===============================
// Authentication: Redirects
// ==============================

router.post("/login", passport.authenticate("local"),
    function (req, res) {
        // console.log("this is where redirect should go");
        res.redirect("/");
        // res.redirect('/users/' + req.user.username); //redirect to user's homepage 
        console.log(req.body.username);

    });

module.exports = router;