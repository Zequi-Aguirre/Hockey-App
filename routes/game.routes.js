// create header for all routes //

const router = require("express").Router();
const Game = require("../models/Game.model");
const Team = require("../models/Team.model");

/* GET home page */
router.get("/game-details/:gameID", (req, res, next) => {
  Game.findById(req.params.gameID)
    .populate("homeTeam")
    .populate("awayTeam")
    .then((gameFromDB) => {
      data = {
        game: gameFromDB,
      };

      res.render("game/game-details", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

function formatDateFuctionOnRead(gameDate) {
  let date = new Date(gameDate);
  console.log(gameDate);

  let month = `${date.getMonth() + 1}`;
  let day = `${date.getDate()}`;
  let year = date.getFullYear();
  console.log(day.length);
  console.log(day);
  console.log(month.length);
  console.log(month);
  if (day.length < 2) {
    day = `0${day}`;
  }
  if (month.length < 2) {
    month = `0${month}`;
  }

  return year + "-" + month + "-" + day;
}

function formatDateFuctionOnWrite(gameDate) {
  let date = new Date(gameDate);

  console.log(date);

  let weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  let selectedDay = date.getDate() + 1;

  let day = weekday[date.getDay() + 1];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  month = months[date.getMonth()];

  year = date.getFullYear();

  return day + ", " + month + " " + selectedDay + ", " + year;
}

router.get("/edit-game/:gameID", (req, res, next) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //

  Game.findById(req.params.gameID)
    .populate("homeTeam")
    .populate("awayTeam")
    .then((gameFromDB) => {
      let gameForViewReady = gameFromDB;

      gameForViewReady.date = formatDateFuctionOnRead(gameForViewReady.date);

      console.log(gameForViewReady.date);
      // console.log(gameForViewReady);
      gamesFromDbResults.push(gameForViewReady);

      let divisionFormating = gamesFromDbResults[0].division;

      switch (divisionFormating) {
        case "AB":
          console.log(divisionFormating);
          console.log("DIVISION HERE");
          divisionFormating = "A/B";
          break;
        case "Over40":
          console.log(divisionFormating);
          console.log("DIVISION HERE");
          divisionFormating = "40+";
          break;

        default:
          break;
      }

      console.log(divisionFormating);
      console.log("DIVISION AFTER");

      Team.find({ division: divisionFormating })
        .then((teamsFromDbResults) => {
          console.log(teamsFromDbResults);

          // teamsFromDbResults.forEach((team) => {
          //   console.log(team.division);
          // });

          // console.log({ teamsFromDbResults: teamsFromDbResults });
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

          console.log({ data: data });

          res.render("game/edit-game-details", data);
          // res.redirect("/game/edit-game-details", data);
        })
        .catch((err) => {
          console.log(err);
        });
      // ==================================== this in all get Roues ==================================== //
    });
});

router.post("/edit-game/:gameID", (req, res, next) => {
  const originalGame = req.params.gameID;
  let updatedGame = req.body;

  // console.log({ updatedGame: updatedGame });

  updatedGame.time = `${updatedGame.hour}:${updatedGame.minutes}${updatedGame["am-pm"]}`;
  updatedGame.date = formatDateFuctionOnWrite(updatedGame.newDate);

  delete updatedGame["hour"];
  delete updatedGame["minutes"];
  delete updatedGame["am-pm"];
  delete updatedGame["newDate"];

  Game.findByIdAndUpdate(originalGame, updatedGame).then((updatedGameFrom) => {
    // res.send(updatedGameFrom);
    res.redirect(`/game/game-details/${updatedGameFrom.id}`);
  });

  // Game.findById(req.params.gameID)
  //   .populate("homeTeam")
  //   .populate("awayTeam")
  //   .then((gameFromDB) => {
  //     //  format date to this "2018-07-22";
  //     data = {
  //       game: gameFromDB,
  //     };
  //     res.render("game/edit-game-details", data);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

module.exports = router;
