var express = require("express"); 
var router = express.Router(); 

// GET HOMEPAGE
router.get("/", function(req, res){
    res.render("login"); 
});

module.exports = router; 