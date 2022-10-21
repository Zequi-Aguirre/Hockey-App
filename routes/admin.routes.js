const router = require("express").Router();
// Require the all models in order to interact with the database
const Game = require("../models/Game.model");
const Player = require("../models/Player.model");
const Team = require("../models/Team.model");
const User = require("../models/User.model");

// -=-=-=-==-=-=---=-=-=-=-= TEAM DETAILS ADMIN -=-=-=-==-=-=---=-=-=-=-= //
router.get("/team-details/:teamID", (req, res, next) => {
  Team.findById(req.params.teamID)
    .populate("playersPartTime")
    .populate("playersFullTime")
    .then((teamFromDB) => {
      const data = {
        thisTeam: teamFromDB,
        // allGames: thisTeamAllGames,
        // season: groupedSeason,
      };

      // res.send(data);
      res.render("admin/team-details-admin", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// -=-=-=-==-=-=---=-=-=-=-= GAME DETAILS ADMIN -=-=-=-==-=-=---=-=-=-=-= //

// ============================== ANY USER DETAILS ====================================== //

router.get("/user-details/:userID", (req, res, next) => {
  // console.log(req.session.user);

  User.findById(req.params.userID)
    .populate("joinedTeams")
    .populate("ownedTeams")
    .then((user) => {
      let master = req.session.user.master;
      let data = {
        user: user,
        master: master,
      };
      res.render("auth/user-details", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ============================== MAKE ADMIN ====================================== //

router.post("/admin-request/:userID", (req, res, next) => {
  console.log(req.session.user);

  User.findByIdAndUpdate(req.params.userID, { admin: true })
    // .populate("joinedTeams")
    // .populate("ownedTeams")
    .then(() => {
      res.redirect("/admin/all-users");
    })
    .catch((err) => {
      console.log(err);
    });
});

// ============================== REMOVE ADMIN ====================================== //

router.post("/admin-removal/:userID", (req, res, next) => {
  console.log(req.session.user);

  User.findById(req.params.userID)
    .then((user) => {
      if (user.master) {
        req.flash(
          "error",
          `You can't remove admin privileges from this user. ${user.email}`
        );
        res.redirect("/admin/all-users");
      } else {
        User.findByIdAndUpdate(req.params.userID, { admin: false })
          // .populate("joinedTeams")
          // .populate("ownedTeams")
          .then(() => {
            res.redirect("/admin/all-users");
          });
      }
    })

    .catch((err) => {
      console.log(err);
    });
});

router.post("/delete-user/:userID", (req, res, next) => {
  console.log(req.session.user);

  User.findByIdAndDelete(req.params.userID)
    .then((user) => {
      res.redirect("/admin/all-users");
    })

    .catch((err) => {
      console.log(err);
    });
});

router.get("/update-user/:userID", (req, res, next) => {
  // console.log(req.session.user);

  User.findById(req.params.userID)
    .populate("joinedTeams")
    .populate("ownedTeams")
    .then((userFromDB) => {
      let master = req.session.user.master;
      let data = {
        userFromDB: userFromDB,
        master: master,
      };
      res.render("admin/update-user", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/update-user/:userID", (req, res, next) => {
  // console.log(req.session.user);

  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let phonenumber = req.body.phonenumber;
  let email = req.body.email;

  console.log(req.params.userID);

  User.findByIdAndUpdate(req.params.userID, {
    firstname: firstname,
    lastname: lastname,
    phonenumber: phonenumber,
    email: email,
  })

    .then((updatedUser) => {
      let master = req.session.user.master;
      let data = {
        // user: updatedUser,
        master: master,
      };
      res.redirect(`/admin/user-details/${updatedUser.id}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ================================= ADMIN ROUTES ================================= //

// ======================= ALL TEAMS =======================

router.get("/all-teams", (req, res) => {
  if (!req.session.user.admin) {
    res.redirect(`/auth/profile`);
  }

  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  Team.find()
    .populate("season")
    .populate("playersFullTime")
    .populate("playersPartTime")
    .then((allResults) => {
      // console.log(userFromDB);

      function compare(a, b) {
        if (a.teamName < b.teamName) {
          return -1;
        }
        if (a.teamName > b.teamName) {
          return 1;
        }
        return 0;
      }

      allResults.sort(compare);

      // ==================================== this in all get Roues ==================================== //

      data = {
        // game: gameForViewReady,
        teamsFromDB: allResults,
        playersFromDB: playersFromDbResults,
        gamesFromDB: gamesFromDbResults,
        usersFromDB: usersFromDbResults,
        currentlyLoggedInUser: currentlyLoggedInUser,
      };

      data = { data };

      console.log({ data: data });

      res.render("admin/all-teams", data);

      // res.render("game/edit-game-details", data);
      // res.redirect("/game/edit-game-details", data);
    })
    .catch((err) => {
      console.log(err);
    })
    // ==================================== this in all get Roues ==================================== //

    .catch((err) => {
      console.log(err);
    });
});

// ======================= ALL PLAYERS =======================

router.get("/all-players", (req, res) => {
  // console.log(req.session.user);
  if (!req.session.user.admin) {
    res.redirect(`/auth/profile`);
  }
  Player.find()
    .populate("joinedTeams")
    // .populate("ownedTeams")
    .then((allResults) => {
      function compare(a, b) {
        if (a.lastName < b.lastName) {
          return -1;
        }
        if (a.lastName > b.lastName) {
          return 1;
        }
        return 0;
      }

      allResults.sort(compare);
      // console.log(userFromDB);
      data = {
        results: allResults,
      };

      res.render("admin/all-players", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ======================= DELETE PLAYERS =======================

router.post("/delete-player/:playerID", (req, res) => {
  let player = req.params.playerID;
  Player.findByIdAndDelete(req.params.playerID)
    .then((player) => {
      Team.find({
        $or: [
          {
            playersFullTime: player.id,
            // division: "C1",
          },
          {
            playersPartTime: player.id,
            // division: "C2 Silver",
          },
        ],
      }).then((teamsFromDB) => {
        console.log({ teamsFromDB });
        Team.updateMany(teamsFromDB[0], {
          $pull: [
            {
              playersFullTime: player,
              playersPartTime: player,
            },
          ],

          // cool: "cool",
        }).then(() => {
          // console.log(teamsFromDB[0]);
          res.redirect("/admin/all-players");
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// ======================= ALL GAMES =======================

router.get("/all-games", (req, res) => {
  if (!req.session.user.admin) {
    res.redirect(`/auth/profile`);
  }
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  Game.find()
    .populate("awayTeam")
    .populate("homeTeam")
    .then((allGames) => {
      // console.log(allGames);
      allGames.forEach((game) => {
        // console.log({ games: game.division });
      });
      // group games by date
      let uniqueDates = [];
      let groupedSeason = [];

      // get unique dates
      allGames.forEach((game) => {
        if (!uniqueDates.includes(game.date)) {
          uniqueDates.push(game.date);
        }
      });

      console.log(uniqueDates.length);

      uniqueDates.forEach((date) => {
        let gameDay = {
          gameday: date,
          games: [],
        };

        allGames.forEach((game) => {
          if (game.date === date) {
            gameDay.games.push(game);
          }
        });

        groupedSeason.push(gameDay);
      });

      groupedSeason.forEach((gameday) => {
        gameday.games.forEach((game) => {
          let gameDay = game.date.split(", ")[0].substring(0, 3);
          let gameMonth = game.date
            .split(", ")[1]
            .split(" ")[0]
            .substring(0, 3);
          let gameDayNumber = game.date.split(", ")[1].split(" ")[1];

          game.date = `${gameDay}, ${gameMonth} ${gameDayNumber}`;

          if (game.homeTeam.teamName.length > 17) {
            game.homeTeam.teamName =
              game.homeTeam.teamName.substring(0, 16) + "...";
          }

          if (game.awayTeam.teamName.length > 17) {
            game.awayTeam.teamName =
              game.awayTeam.teamName.substring(0, 16) + "...";
          }
        });
      });

      // allGames.forEach((game) => {
      //   groupedSeason[game.date].push(game);
      // });

      // console.log(groupedSeason);

      gamesFromDbResults = groupedSeason;

      data = {
        // game: gameForViewReady,
        teamsFromDB: teamsFromDbResults,
        playersFromDB: playersFromDbResults,
        gamesFromDB: gamesFromDbResults,
        usersFromDB: usersFromDbResults,
        currentlyLoggedInUser: currentlyLoggedInUser,
      };

      data = { data };

      // const data = {
      //   allGames: allGames,
      //   season: groupedSeason,
      // };

      res.render("admin/all-games", data);
      // res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ======================= ALL USERS =======================

router.get("/all-users", (req, res) => {
  if (!req.session.user.admin) {
    res.redirect(`/auth/profile`);
  }
  User.find()
    .populate("joinedTeams")
    .populate("ownedTeams")
    .then((allResults) => {
      // console.log(userFromDB);
      function compare(a, b) {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0;
      }

      allResults.sort(compare);

      data = {
        results: allResults,
      };

      res.render("admin/all-users", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ================================= ADMIN ROUTES ================================= //

module.exports = router;
