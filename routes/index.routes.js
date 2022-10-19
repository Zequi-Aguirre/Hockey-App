const router = require("express").Router();
const Game = require("../models/Game.model");

/* GET home page */
router.get("/", (req, res, next) => {
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

      res.render("index", data);
      // res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
