// create header for all routes //

const router = require("express").Router();
const Game = require("../models/Game.model");
const Team = require("../models/Team.model");
const Player = require("../models/Player.model");

/* GET home page */
router.get("/game-details/:gameID", (req, res, next) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //

  if (!currentlyLoggedInUser) {
    req.flash("error", "Login or Create a FREE ACOUNT to see game details");
    res.redirect("/auth/login");
  }
  Game.findById(req.params.gameID)
    .populate("homeTeam")
    .populate("awayTeam")
    .then((gameFromDB) => {
      console.log({ game: gameFromDB.homeTeam.id });
      console.log({ game: gameFromDB.awayTeam.id });
      Team.find({
        $or: [
          { teamName: gameFromDB.homeTeam.teamName },
          { teamName: gameFromDB.awayTeam.teamName },
        ],
      })
        .populate("playersFullTime")
        .populate("playersPartTime")
        .then((teamsFromDB) => {
          console.log(teamsFromDB);
          let homeTeam;
          let awayTeam;
          teamsFromDB.forEach((team) => {
            if (team.teamName === gameFromDB.homeTeam.teamName) {
              homeTeam = team;
            } else if (team.teamName === gameFromDB.awayTeam.teamName) {
              awayTeam = team;
            }
          });

          teamsFromDB = {
            hometeam: homeTeam,
            awayteam: awayTeam,
          };

          console.log(teamsFromDB);
          teamsFromDbResults = teamsFromDB;
          gamesFromDbResults.push(gameFromDB);
          data = {
            // game: gameForViewReady,
            teamsFromDB: teamsFromDbResults,
            playersFromDB: playersFromDbResults,
            gamesFromDB: gamesFromDbResults,
            usersFromDB: usersFromDbResults,
            currentlyLoggedInUser: currentlyLoggedInUser,
          };

          data = { data };

          console.log(data);

          res.render("game/game-details", data);
        });
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

  let weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

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

  let monthIndex = date.getMonth();
  year = date.getFullYear();
  let selectedDay = date.getDate();

  switch (monthIndex) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      if (selectedDay > 31) {
        selectedDay = 1;
        monthIndex = monthIndex + 1;
      }
      break;

    case 3:
    case 5:
    case 8:
    case 10:
      if (selectedDay > 30) {
        selectedDay = 1;
        monthIndex = monthIndex + 1;
      }
      break;

    case 1:
      if ((0 == year % 4 && 0 != year % 100) || 0 == year % 400) {
        console.log(year + " is a leap year");
        if (selectedDay > 29) {
          selectedDay = 1;
          monthIndex = monthIndex + 1;
        }
      } else {
        console.log(year + " is not a leap year");
        if (selectedDay > 28) {
          selectedDay = 1;
          monthIndex = monthIndex + 1;
        }
      }
      break;

    default:
      break;
  }

  month = months[monthIndex];

  if (selectedDay > 31) {
    selectedDay = 1;
    month = months[monthIndex + 1];
  }

  let day = weekday[date.getDay()];

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

          // res.render("game/create-game", data);
          res.render("game/edit-game-details", data);
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
});

router.post("/delete-game/:gameID", (req, res, next) => {
  Game.findByIdAndDelete(req.params.gameID).then((game) => {
    // res.send(updatedGameFrom);
    req.flash("success", `Deleted ${game}`);
    res.redirect(`/`);
  });
});

router.post("/create-game", (req, res, next) => {
  // const originalGame = req.params.gameID;
  let newGame = req.body;

  // console.log({ newGame: newGame });

  newGame.time = `${newGame.hour}:${newGame.minutes}${newGame["am-pm"]}`;
  newGame.date = formatDateFuctionOnWrite(newGame.newDate);

  delete newGame["hour"];
  delete newGame["minutes"];
  delete newGame["am-pm"];
  delete newGame["newDate"];

  Game.create(newGame).then((newGameFrom) => {
    // res.send(newGameFrom);
    res.redirect(`/game/game-details/${newGameFrom.id}`);
  });
});

router.get("/create-game", (req, res, next) => {
  // ==================================== this in all get Roues ==================================== //
  let teamsFromDbResults = [];
  let playersFromDbResults = [];
  let gamesFromDbResults = [];
  let usersFromDbResults = [];
  let currentlyLoggedInUser = req.session.user;
  // ==================================== this in all get Roues ==================================== //
  // const originalGame = req.params.gameID;
  Team.find()
    .then((teamsFromDB) => {
      teamsFromDbResults = teamsFromDB;
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
      res.render(`game/create-game`, data);

      // res.render("game/create-game", data);
      // res.redirect("/game/edit-game-details", data);
    })

    .catch((err) => {
      console.log(err);
    });
  // ==================================== this in all get Roues ==================================== //
});

router.get("/all-games", (req, res, next) => {
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

      res.render("game/all-games", data);
      // res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
