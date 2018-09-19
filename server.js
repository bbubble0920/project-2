require("dotenv").config();
// Dependencies 
var express = require("express");
var path = require("path"); 
var flash = require("connect-flash"); 
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser"); 
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator"); 
var session = require("express-session"); 
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var routes = require("./routes/htmlRoutes");
var apiRoutes = require("./routes/apiRoutes"); 


//Init App
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cookieParser()); 

// Handlebars
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Set Static Folder - for file sheets, jquery, etc
app.use(express.static(path.join(__dirname, "public"))); 

// Express Session 
app.use(session({
  secret: "secret", 
  saveUninitialized: true,
  resave: true
})); 

var syncOptions = { force: false };


// ======================
// PASSPORT SESSION 
// ======================
app.use(passport.initialize()); 
app.use(passport.session()); 

// EXPRESS VALIDATOR 
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split("."), 
    root = namespace.shift(), 
    formParam = root;

    while(namespace.length){
      formParam += "[" + namespace.shift() + "]"; 
    }
    return {
      param: formParam, 
      msg : msg, 
      value: value
    };
  }
})); 

// Connect Flash
app.use(flash()); 

// Global Vars for Flash
app.use(function(req, res, next){
  res.locals.success_msg = req.flash("success_msg"); 
  res.locals.error_msg = req.flash("error_msg"); 
  res.locals.error = req.flash("error"); 
  next(); 
}); 

// Routes
app.use("/", routes); 
app.use("/apiRoutes", apiRoutes); 


// Starting the server, syncing our models ------------------------------------/
app.listen(PORT, function() {
  console.log("\nApp listening on PORT " + PORT);
});

module.exports = app;
