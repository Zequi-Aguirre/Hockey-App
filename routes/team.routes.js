const router = require("express").Router();

// ℹ️ Handles password encryption
const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Team = require("../models/Team.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/add-teams/:userID", (req, res) => {
  res.render("team/add-teams");
});

module.exports = router;
