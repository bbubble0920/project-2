var express = require("express"); 
var router = express.Router(); 

// Import model (models.js) to use database functions
var wwdb = require('../models/models.js');

// GET HOMEPAGE
router.get("/", function(req, res){
    res.render("index"); 
});

router.get("/artist/:id", function(req, res){
    res.render("artistpage"); 
});

module.exports = router; 