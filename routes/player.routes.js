const router = require("express").Router();
const Player = require("../models/Player.model");

/* GET home page */
router.get("/player-details/:playerID", (req, res, next) => {
  Player.findById(req.params.playerID)
    .then((playerFromDB) => {
      data = {
        player: playerFromDB,
      };

      res.render("player/player-details", data);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
