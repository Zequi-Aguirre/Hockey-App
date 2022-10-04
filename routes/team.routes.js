const router = require("express").Router();

// ℹ️ Handles password encryption
const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Game = require("../models/Game.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/add-teams/:userID", (req, res) => {
  // console.log(
  //   Team.find().then((teams) => {
  //     teams.sort();
  //     teams.forEach((team) => {
  //       // console.log(team.teamName);
  //       // console.log(team.teamCode);
  //     });
  //   })
  // );
  res.render("team/add-teams");
});

router.post("/add-teams/:userID", (req, res) => {
  console.log(req.body.teamcode);
  Team.find({ teamCode: req.body.teamcode })
    .then((teamFromDB) => {
      console.log(teamFromDB);
      User.findByIdAndUpdate(req.params.userID, {
        $addToSet: { teams: teamFromDB },
      }).then((updatedUser) => {
        console.log(updatedUser);
        // res.send({ updatedUser, teamFromDB });
        res.redirect(`/team/your-teams/${req.params.userID}`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/your-teams/:userID", (req, res) => {
  User.findById(req.params.userID)
    .populate("teams")
    .then((userFromDB) => {
      console.log(userFromDB);
      data = {
        teams: userFromDB.teams,
      };

      res.render("team/your-teams", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/team-detail/:teamID", (req, res) => {
  Team.findById(req.params.teamID)
    .then((teamFromDB) => {
      console.log(teamFromDB);

      Game.find({
        $or: [{ homeTeam: teamFromDB._id }, { awayTeam: teamFromDB._id }],
      })
        .populate("homeTeam")
        .populate("awayTeam")
        .then((gamesFromDB) => {
          console.log(gamesFromDB);
          data = {
            games: gamesFromDB,
          };

          // res.send(data);
          res.render("team/team-details", data);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
