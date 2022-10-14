const router = require("express").Router();
const xlsx = require("xlsx");
const express = require("express");
const Season = require("../models/Season.model");
const Team = require("../models/Team.model");
const Game = require("../models/Game.model");
const fs = require("fs");
const formidable = require("formidable");
// const uploadMiddleware = require("../config/multer-file-upload");

const multer = require("multer");

let fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("path------------------------------");
    cb(null, "./xlsx");
  },
  filename: (req, file, cb) => {
    console.log("file------------------------------");
    console.log(file);
    cb(null, file.originalname);
  },
});

// const uploadFile = multer({ storage: fileStorageEngine });
const uploadFile = multer({ dest: "public/xlsx" });

/* GET home page */
router.get("/create-season", (req, res, next) => {
  res.render("season/create-season");
});

router.post(
  "/create-season",
  uploadFile.single("fileupload"),
  (req, res, next) => {
    // console.log({ file: req.file });

    fs.rename(
      `./public/xlsx/${req.file.filename}`,
      `./public/xlsx/${req.file.originalname}`,
      () => {
        // console.log("name changed");
        // List all the filenames after renaming
        // getCurrentFilenames();
      }
    );

    // console.log(`req================

    // ============.file`);

    console.log(`./public/xlsx/${req.file.originalname}`);

    const workBook = xlsx.readFile(`./public/xlsx/${req.file.originalname}`);

    const workSheet = workBook.Sheets["Master"];

    const data = xlsx.utils.sheet_to_json(workSheet);

    function generateRandomCode(length) {
      let result = "";
      let characters = "0123456789";
      let charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    // const newSeason = {
    //   seasonName: req.body.seasonName,
    // };

    let allTeams = [];

    data.forEach((game) => {
      const homeTeam = {
        teamName: game.home,
        ownCode: generateRandomCode(6),
        joinCode: generateRandomCode(6),
        division: game.division,
      };

      const awayTeam = {
        teamName: game.away,
        ownCode: generateRandomCode(6),
        joinCode: generateRandomCode(6),
        division: game.division,
      };

      if (!allTeams.includes(homeTeam)) {
        allTeams.push(homeTeam);
      }

      if (!allTeams.includes(awayTeam)) {
        allTeams.push(awayTeam);
      }
    });

    const key = "teamName";

    const allTeamsUnique = [
      ...new Map(allTeams.map((item) => [item[key], item])).values(),
    ];

    let allGames = [];

    data.forEach((game) => {
      const fullDateCode = new Date(
        -2209075200000 + (game.date - (game.date < 61 ? 0 : 1)) * 86400000
      );
      const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      const months = [
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

      const gameDate = `${days[fullDateCode.getDay()]}, ${
        months[fullDateCode.getMonth()]
      } ${fullDateCode.getDate() + 1}, ${fullDateCode.getFullYear()}`;

      if (game.division === "A/B") {
        game.division = "AB";
      }

      if (game.division === "40+") {
        game.division = "Over40";
      }

      const newGame = {
        homeTeam: game.home,
        awayTeam: game.away,
        date: gameDate,
        time: game.time,
        location: game.location,
        division: game.division,
      };

      allGames.push(newGame);
    });

    // console.log(allGames);

    Team.insertMany(allTeamsUnique)
      .then((teamsCreated) => {
        // console.log("teamsCreated");
        // console.log(teamsCreated.length);
        // console.log("allGames");
        // console.log(allGames.length);
        allGames.map((game) => {
          teamsCreated.forEach((team) => {
            if (team.teamName === game.homeTeam) {
              game.homeTeam = team.id;
            }
            if (team.teamName === game.awayTeam) {
              game.awayTeam = team.id;
            }
          });
        });
        Game.insertMany(allGames)
          .then((gamesCreated) => {
            console.log(req.body.seasonName);
            let newSeason = {
              seasonName: req.body.seasonName,
              games: gamesCreated,
            };

            Season.create(newSeason)
              .then((seasonCreated) => {
                console.log(seasonCreated);
                let data = {
                  teamsCount: allTeamsUnique.length,
                  gamesCount: gamesCreated.length,
                };
                req.flash(
                  "success",
                  `New season created ${seasonCreated.seasonName} with a total of ${allTeamsUnique.length} TEAMS and ${gamesCreated.length} GAMES`
                );

                res.redirect("/");
              })
              .catch((err) => {
                console.log(err);
              });
            // console.log(gamesCreated)
          })
          .catch((err) => console.log(err));
      })
      .catch();

    // console.log(allGames);
  }
);

module.exports = router;
