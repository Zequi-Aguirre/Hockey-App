const router = require("express").Router();

// ℹ️ Handles password encryption
const mongoose = require("mongoose");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Game = require("../models/Game.model");
const Player = require("../models/Player.model");
const nodemailer = require("nodemailer");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const { Router } = require("express");

router.get("/team-detail/:teamID", (req, res) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  Team.findById(req.params.teamID)
    .populate("playersPartTime")
    .populate("playersFullTime")

    .then((teamFromDB) => {
      // console.log(teamFromDB);
      // teamsFromDbResults.push(teamFromDB);

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

          gamesFromDbResults = groupedSeason;
          teamsFromDbResults.push(teamFromDB);

          // ==================================== this in all get Roues ==================================== //

          data = {
            // game: gameForViewReady,
            teamsFromDB: teamsFromDbResults,
            playersFromDB: playersFromDbResults,
            gamesFromDB: gamesFromDbResults,
            usersFromDB: usersFromDbResults,
            currentlyLoggedInUser: currentlyLoggedInUser,
          };

          data = { data };

          res.render("team/team-details", data);
        })
        .catch((err) => {
          console.log(err);
          // ==================================== this in all get Roues ==================================== //

          // res.send(data);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/invite-all/:teamID", (req, res) => {
  Team.findById(req.params.teamID)
    .populate("playersFullTime")
    .then((team) => {
      //=============================================================================
      team.playersFullTime.forEach((fullTimePlayer) => {
        console.log({ player: fullTimePlayer });
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          // let testAccount = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "mail.zequi4real.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.CPANELUSER, // generated ethereal user
              pass: process.env.CPANELPASS, // generated ethereal password
            },
            tls: {
              rejectUnauthorized: false,
            },
          });

          let emailOptions = {
            from: '"Zequi Movies App! 👻" <admin@zequi4real.com>', // sender address
            to: fullTimePlayer.emailAddress, // list of receivers
            subject: "Thanks for joining!", // Subject line
            // text: "Hello world?", // plain text body

            html: `Hello ${fullTimePlayer.name}, welcome to Zequi Movies App, confirm your email address by clicking <form action="http://localhost:3000/emailconfirmation/${fullTimePlayer._id}" method="post">

                <button>HERE</button>

                   </form>  `, // html body
          };

          // send mail with defined transport object
          let info = await transporter.sendMail(emailOptions);

          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

          // Preview only available when sending through an Ethereal account
          // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }
        res.send(team.playersFullTime);
      });

      //=============================================================================
      //
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/edit-team/:teamID", (req, res) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  Team.findById(req.params.teamID)
    .populate("playersPartTime")
    .populate("playersFullTime")

    .then((teamFromDB) => {
      // console.log(teamFromDB);
      // teamsFromDbResults.push(teamFromDB);

      // gamesFromDbResults = thisTeamAllGames;
      teamsFromDbResults.push(teamFromDB);

      // ==================================== this in all get Roues ==================================== //

      data = {
        // game: gameForViewReady,
        teamsFromDB: teamsFromDbResults,
        playersFromDB: playersFromDbResults,
        gamesFromDB: gamesFromDbResults,
        usersFromDB: usersFromDbResults,
        currentlyLoggedInUser: currentlyLoggedInUser,
      };

      data = { data };

      res.render("team/edit-team", data);
    })
    .catch((err) => {
      console.log(err);
      // ==================================== this in all get Roues ==================================== //

      // res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/invite-player/:teamID", (req, res) => {});

module.exports = router;
