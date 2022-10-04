const router = require("express").Router();
const Game = require("../models/Game.model");

/* GET home page */
router.get("/", (req, res, next) => {
  Game.find()
    .populate("awayTeam")
    .populate("homeTeam")
    .then((allGames) => {
      // console.log(allGames);
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

      // allGames.forEach((game) => {
      //   groupedSeason[game.date].push(game);
      // });

      // console.log(groupedSeason);

      const data = {
        allGames: allGames,
        season: groupedSeason,
      };

      res.render("index", data);
      // res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
