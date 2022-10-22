const router = require("express").Router();
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Game = require("../models/Game.model");
const Player = require("../models/Player.model");

/* GET home page */
router.get("/player-details/:playerID", (req, res, next) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //

  Player.findById(req.params.playerID)
    .populate("joinedTeams")
    .then((playerFromDB) => {
      playersFromDbResults.push(playerFromDB);

      console.log({ currentUser: currentlyLoggedInUser });

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

      res.render("player/player-details", data);
    })
    .catch((err) => {
      console.log(err);
      // ==================================== this in all get Roues ==================================== //
    });
});

// -=-=-=-==-=--=-=-==-=-==---=-=-=-=-=-=-=- ADD PLAYER -=-=-=-==-=--=-=-==-=-==---=-=-=-=-=-=-=- //

router.get("/add-players/:teamID", (req, res) => {
  if (req.session.user) {
    let teamID = req.params.teamID;
    Team.findById(teamID)
      .populate("playersPartTime")
      .populate("playersFullTime")
      .then((team) => {
        User.findById(req.session.user._id)
          .then((user) => {
            let ownedTeam = user.ownedTeams.includes(team._id);
            // console.log(user);
            let data = {
              ownedTeam: ownedTeam,
              team: team,
            };

            res.render("player/add-players", data);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  } else {
    res.redirect("/auth/login");
  }
});

router.post("/add-players/:teamID", (req, res) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  const newPlayer = {
    // name: req.body.name,
    // lastName: req.body.lastname,
    // phoneNumber: req.body.phonenumber,
    emailAddress: req.body.email,
    // jerseyNumber: req.body.jerseynumber,
  };
  console.log({ newPlayer: newPlayer });
  Player.find(newPlayer).then((playersFromDbResults) => {
    console.log(playersFromDbResults);
    Team.findById(req.params.teamID)
      .then((teamFromDB) => {
        if (!playersFromDbResults.length) {
          // console.log(currentlyLoggedInUser);
          // console.log({ currentlyLoggedInUser: currentlyLoggedInUser });
          teamsFromDbResults.push(teamFromDB);

          playersFromDbResults.push(newPlayer);
          // ==================================== this in all get Roues ==================================== //

          data = {
            // game: gameForViewReady,
            teamsFromDB: teamsFromDbResults,
            playersFromDB: playersFromDbResults[0],
            gamesFromDB: gamesFromDbResults,
            usersFromDB: usersFromDbResults,
            currentlyLoggedInUser: currentlyLoggedInUser,
          };

          data = { data };

          console.log(data);

          res.render("player/create-players", data);
          // res.redirect("/game/edit-game-details", data);
        } else if (playersFromDbResults.length) {
          // console.log(currentlyLoggedInUser);
          // console.log({ currentlyLoggedInUser: currentlyLoggedInUser });
          teamsFromDbResults.push(teamFromDB);

          playersFromDbResults.push(newPlayer);
          // ==================================== this in all get Roues ==================================== //

          data = {
            // game: gameForViewReady,
            teamsFromDB: teamsFromDbResults,
            playersFromDB: playersFromDbResults[0],
            gamesFromDB: gamesFromDbResults,
            usersFromDB: usersFromDbResults,
            currentlyLoggedInUser: currentlyLoggedInUser,
          };

          data = { data };

          console.log(data);

          res.render("player/invite-players", data);
          // res.redirect("/game/edit-game-details", data);
        }
      })
      .catch((err) => {
        console.log(err);
        // ==================================== this in all get Roues ==================================== //
      });
  });
});

router.post("/create-players/:teamID", (req, res) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  const newPlayer = {
    name: req.body.name,
    lastName: req.body.lastname,
    phoneNumber: req.body.phonenumber,
    emailAddress: req.body.email,
    jerseyNumber: req.body.jerseynumber,
    joinedTeams: [req.params.teamID],
  };
  console.log({ newPlayer: newPlayer });
  Player.create(newPlayer).then((newlyCratedPlayer) => {
    playersFromDbResults.push(newlyCratedPlayer);
    console.log(playersFromDbResults);
    console.log(req.body.fullorpart);

    const fullorpart = req.body.fullorpart;
    if (fullorpart === "playersFullTime") {
      Team.findByIdAndUpdate(req.params.teamID, {
        $addToSet: { playersFullTime: newlyCratedPlayer._id },
      })
        .then((teamFromDB) => {
          // console.log(currentlyLoggedInUser);
          // console.log({ currentlyLoggedInUser: currentlyLoggedInUser });
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

          // res.render("player/create-players", data);
          res.redirect(`/team/team-detail/${req.params.teamID}`);
        })
        .catch((err) => {
          console.log(err);
          // ==================================== this in all get Roues ==================================== //
        });
    } else if (fullorpart === "playersPartTime") {
      Team.findByIdAndUpdate(req.params.teamID, {
        $addToSet: { playersPartTime: newlyCratedPlayer._id },
      })
        .then((teamFromDB) => {
          // console.log(currentlyLoggedInUser);
          // console.log({ currentlyLoggedInUser: currentlyLoggedInUser });
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

          // res.render("player/create-players", data);
          res.redirect(`/team/team-detail/${req.params.teamID}`);
        })
        .catch((err) => {
          console.log(err);
          // ==================================== this in all get Roues ==================================== //
        });
    }
  });
});

router.post("/invite-player/:playerID/:teamID", (req, res) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //

  const teamID = req.params.teamID;
  const playerID = req.params.playerID;

  Player.findByIdAndUpdate(playerID, {
    $addToSet: { joinedTeams: teamID },
  }).then((updatedPlayer) => {
    Team.findById(teamID).then(() => {
      const fullorpart = req.body.fullorpart;
      if (fullorpart === "playersFullTime") {
        Team.findByIdAndUpdate(req.params.teamID, {
          $addToSet: { playersFullTime: updatedPlayer._id },
        })
          .then((teamFromDB) => {
            // console.log(currentlyLoggedInUser);
            // console.log({ currentlyLoggedInUser: currentlyLoggedInUser });
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

            // res.render("player/create-players", data);
            res.redirect(`/team/team-detail/${req.params.teamID}`);
          })
          .catch((err) => {
            console.log(err);
            // ==================================== this in all get Roues ==================================== //
          });
      } else if (fullorpart === "playersPartTime") {
        Team.findByIdAndUpdate(req.params.teamID, {
          $addToSet: { playersPartTime: updatedPlayer._id },
        })
          .then((teamFromDB) => {
            // console.log(currentlyLoggedInUser);
            // console.log({ currentlyLoggedInUser: currentlyLoggedInUser });
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

            // res.render("player/create-players", data);
            res.redirect(`/team/team-detail/${req.params.teamID}`);
          })
          .catch((err) => {
            console.log(err);
            // ==================================== this in all get Roues ==================================== //
          });
      }
    });
  });
});

router.get("/edit-player/:playerID", (req, res) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  Player.findById(req.params.playerID)
    .populate("joinedTeams")
    // .populate("playersFullTime")

    .then((playerFromDB) => {
      // console.log(teamFromDB);
      // teamsFromDbResults.push(teamFromDB);

      // gamesFromDbResults = thisTeamAllGames;
      playersFromDbResults.push(playerFromDB);

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

      res.render("player/edit-player", data);
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

router.post("/edit-player/:playerID", (req, res) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  let newPlayerInformation = req.body;
  console.log(newPlayerInformation);
  Player.findByIdAndUpdate(req.params.playerID, newPlayerInformation)
    .populate("joinedTeams")
    // .populate("playersFullTime")

    .then((playerFromDB) => {
      // console.log(teamFromDB);
      // teamsFromDbResults.push(teamFromDB);

      // gamesFromDbResults = thisTeamAllGames;
      playersFromDbResults.push(playerFromDB);

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

      // res.send(playerFromDB);

      res.redirect(`/player/player-details/${playerFromDB.id}`);

      // res.render("player/edit-player", data);
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

module.exports = router;
