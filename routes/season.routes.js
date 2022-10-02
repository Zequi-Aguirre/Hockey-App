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
  // uploadFile.single("excelFile"),
  (req, res, next) => {
    // let form = new formidable.IncomingForm();

    // form.parse(req, function (error, fields, file) {
    //   console.log(file.fileupload.filepath);
    //   let filepath = file.fileupload.filepath;
    //   let newpath = "/public/xlsx";
    //   console.log(process.cwd() + newpath);
    //   console.log(file.fileupload.originalFilename);
    //   newpath += file.fileupload.originalFilename;
    //   fs.rename(filepath, newpath, function () {
    //     console.log("Done");
    //     res.end();
    //   });
    // });
    console.log(`req================
    
    
    
    
    
    
    ============.file`);

    console.log(req.body.file);

    console.log(`req================
    
  
    
    
    
    
    ============.file`);

    const workBook = xlsx.readFile(`PAHL Fall 2022 Schedule2.xlsx`);

    const workSheet = workBook.Sheets["Master"];

    const data = xlsx.utils.sheet_to_json(workSheet);

    function generateRandomPassword(length) {
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

    const newSeason = {
      seasonName: req.body.seasonName,
    };

    let allTeams = [];

    data.forEach((game) => {
      const homeTeam = {
        teamName: game.home,
        teamCode: generateRandomPassword(6),
        division: game.division,
      };

      const awayTeam = {
        teamName: game.away,
        teamCode: generateRandomPassword(6),
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
      } ${fullDateCode.getDate()}, ${fullDateCode.getFullYear()}`;

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

    console.log(allGames);

    Team.insertMany(allTeamsUnique)
      .then((teamsCreated) => {
        console.log("teamsCreated");
        console.log(teamsCreated.length);
        console.log("allGames");
        console.log(allGames.length);
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
          .then((gamesCreated) => console.log(gamesCreated))
          .catch((err) => console.log(err));
        console.log(err);
      })
      .catch();

    console.log(allGames);
    res.render("season/create-season");
  }
);

module.exports = router;
