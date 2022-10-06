const router = require("express").Router();
const Game = require("../models/Game.model");

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

module.exports = router;
