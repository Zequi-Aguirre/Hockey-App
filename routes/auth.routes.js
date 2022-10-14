const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Team = require("../models/Team.model");
const Player = require("../models/Player.model");
const Game = require("../models/Game.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { firstname, lastname, phonenumber, email, password } = req.body;

  if (!email) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your email.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Email already in use." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          firstname,
          lastname,
          phonenumber,

          email,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Email need to be unique. The email you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your email." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .populate("joinedTeams")
    .populate("ownedTeams")

    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        // console.log(user);
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/auth/profile");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("auth/login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }

    res.redirect("/");
  });
});

router.get("/profile", (req, res, next) => {
  // console.log(req.session.user);

  User.findById(req.session.user)
    .populate("joinedTeams")
    .populate("ownedTeams")
    .then((user) => {
      let data = {
        user: user,
      };
      req.session.user = user;
      res.render("auth/profile", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ========================= MANAGE TEAMS IN YOUR ACCOUNT ========================= //

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
  // console.log(req.body.teamcode);
  Team.findOne({ ownCode: req.body.owncode })
    .then((teamFromDB) => {
      // if (!teamFromDB) {
      //   res.render("team/join-teams", {
      //     errorMessageManage:
      //       "No team found to manage, double check your code.",
      //   });
      // }
      // console.log(teamFromDB);
      User.findByIdAndUpdate(req.params.userID, {
        $addToSet: { ownedTeams: teamFromDB },
      }).then(() => {
        if (!teamFromDB) {
          req.flash(
            "error",
            "No team found to manage, double check your code."
          );
        }
        res.redirect(`/auth/profile`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/join-teams/:userID", (req, res) => {
  // console.log(
  //   Team.find().then((teams) => {
  //     teams.sort();
  //     teams.forEach((team) => {
  //       // console.log(team.teamName);
  //       // console.log(team.teamCode);
  //     });
  //   })
  // );
  res.render("team/join-teams");
});

router.post("/join-teams/:userID", (req, res) => {
  console.log(req.body.joincode);
  Team.findOne({ joinCode: req.body.joincode })
    .then((teamFromDB) => {
      // if (!teamFromDB) {
      //   res.render("team/join-teams", {
      //     errorMessageJoin: "No team found to join, double check your code.",
      //   });
      // }
      console.log(teamFromDB);
      User.findByIdAndUpdate(req.params.userID, {
        $addToSet: { joinedTeams: teamFromDB },
      }).then(() => {
        if (!teamFromDB) {
          req.flash("error", "No team found to join, double check your code.");
        }
        res.redirect(`/auth/profile`);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/remove-owned-team/:teamID", (req, res) => {
  Team.findById(req.params.teamID)
    .then((team) => {
      // console.log(team);
      User.findByIdAndUpdate(req.session.user, {
        $pull: { ownedTeams: team.id },
      }).then(() => {
        // console.log(updatedUser);
        // res.send({ updatedUser, teamFromDB });
        // res.redirect(`/auth/your-teams/${req.params.userID}`);
        res.redirect(`/auth/profile`);

        // res.render("team/your-teams");
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/remove-joined-team/:teamID", (req, res) => {
  Team.findById(req.params.teamID)
    .then((team) => {
      // console.log(team);
      User.findByIdAndUpdate(req.session.user, {
        $pull: { joinedTeams: team.id },
      }).then(() => {
        // console.log(updatedUser);
        // res.send({ updatedUser, teamFromDB });
        // res.redirect(`/auth/your-teams/${req.params.userID}`);
        res.redirect(`/auth/profile`);

        // res.render("team/your-teams");
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/your-teams/:userID", (req, res) => {
  User.findById(req.params.userID)
    .populate("joinedTeams")
    .populate("ownedTeams")
    .then((userFromDB) => {
      // console.log(userFromDB);
      data = {
        teams: userFromDB.teams,
      };

      res.render("team/your-teams", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ================================= ADMIN ROUTES ================================= //

// ======================= ALL TEAMS =======================

router.get("/admin/all-teams", (req, res) => {
  if (!req.session.user.admin) {
    res.redirect(`/auth/profile`);
  }
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
      data = {
        results: allResults,
      };

      res.render("auth/all-results", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ======================= ALL PLAYERS =======================

router.get("/admin/all-players", (req, res) => {
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

      res.render("auth/all-results", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ======================= DELETE PLAYERS =======================

router.post("/admin/delete-player/:playerID", (req, res) => {
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
        console.log({ teams: { teamsFromDB } });
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
          res.redirect("/auth/admin/all-players");
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// ======================= ALL GAMES =======================

router.get("/admin/all-games", (req, res) => {
  if (!req.session.user.admin) {
    res.redirect(`/auth/profile`);
  }
  Game.find()
    .populate("season")
    .populate("homeTeam")
    .populate("awayTeam")
    .then((allResults) => {
      // console.log(allResults[0]);

      allResults.forEach((game) => {
        let gameDay = game.date.split(", ")[0].substring(0, 3);
        let gameMonth = game.date.split(", ")[1].split(" ")[0].substring(0, 3);
        let gameDayNumber = game.date.split(", ")[1].split(" ")[1];

        game.date = `${gameDay}, ${gameMonth} ${gameDayNumber}`;
      });
      data = {
        results: allResults,
      };

      res.render("auth/all-results", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ======================= ALL USERS =======================

router.get("/admin/all-users", (req, res) => {
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

      res.render("auth/all-results", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ============================== ANY USER PROFILE ====================================== //

router.get("/user-details/:userID", (req, res, next) => {
  console.log(req.session.user);

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
      res.redirect("/auth/admin/all-users");
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
        res.redirect("/auth/admin/all-users");
      } else {
        User.findByIdAndUpdate(req.params.userID, { admin: false })
          // .populate("joinedTeams")
          // .populate("ownedTeams")
          .then(() => {
            res.redirect("/auth/admin/all-users");
          });
      }
    })

    .catch((err) => {
      console.log(err);
    });
});

// ================================= ADMIN ROUTES ================================= //

module.exports = router;
