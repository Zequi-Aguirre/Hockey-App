const router = require("express").Router();

// ℹ️ Handles password encryption
const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Game = require("../models/Game.model");
const Player = require("../models/Player.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { Router } = require("express");

router.get("/team-detail/:teamID", (req, res) => {
  Team.findById(req.params.teamID)
    .populate("playersPartTime")
    .populate("playersFullTime")

    .then((teamFromDB) => {
      // console.log(teamFromDB);

      Game.find({
        $or: [{ homeTeam: teamFromDB._id }, { awayTeam: teamFromDB._id }],
      })
        .populate("homeTeam")
        .populate("awayTeam")
        .then((thisTeamAllGames) => {
          let uniqueDates = [];
          let groupedSeason = [];

          // get unique dates
          thisTeamAllGames.forEach((game) => {
            if (!uniqueDates.includes(game.date)) {
              uniqueDates.push(game.date);
            }
          });

          // console.log(uniqueDates.length);

          uniqueDates.forEach((date) => {
            let gameDay = {
              gameday: date,
              games: [],
            };

            thisTeamAllGames.forEach((game) => {
              if (game.date === date) {
                gameDay.games.push(game);
              }
            });

            groupedSeason.push(gameDay);
          });

          const data = {
            thisTeam: teamFromDB,
            allGames: thisTeamAllGames,
            season: groupedSeason,
          };

          // res.send(data);
          res.render("team/team-details", data);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/add-players/:teamID", (req, res) => {
  let teamID = req.params.teamID;
  Team.findById(teamID)
    .populate("playersPartTime")
    .populate("playersFullTime")
    .then((team) => {
      User.findById(req.session.user)
        .then((user) => {
          let ownedTeam = user.teams.includes(team._id);
          console.log(user);
          let data = {
            ownedTeam: ownedTeam,
            team: team,
          };

          res.render("team/add-players", data);
        })
        .catch((err) => {
          console.log(err);
        });
    });
});

router.post("/add-players/:teamID", (req, res) => {
  const newPlayer = {
    name: req.body.name,
    lastName: req.body.lastname,
    phoneNumber: req.body.phonenumber,
    emailAddress: req.body.email,
    jerseyNumber: req.body.jerseynumber,
  };
  Player.create(newPlayer)
    .then((playerCreated) => {
      if (req.body.fullorpart === "full-time") {
        Team.findByIdAndUpdate(req.params.teamID, {
          $addToSet: { playersFullTime: playerCreated._id },
        })
          // .populate("playersPartTime")
          // .populate("playersFullTime")
          .then((team) => {
            res.redirect(`/team/team-detail/${req.params.teamID}`);
          });
      } else if (req.body.fullorpart === "part-time") {
        Team.findByIdAndUpdate(req.params.teamID, {
          $addToSet: { playersPartTime: playerCreated._id },
        })
          // .populate("playersPartTime")
          // .populate("playersFullTime")
          .then((team) => {
            res.redirect(`/team/team-detail/${req.params.teamID}`);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
