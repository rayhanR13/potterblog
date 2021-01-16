const express = require("express");
const router = express.Router();

// Index route
router.get("/", (req, res) => {
    res.render("index", { title: "Home" });
});

// About route
router.get("/about", (req, res) => {
    res.render("about", { title: "About" });
});

module.exports = router;
