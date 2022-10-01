const xlsx = require("xlsx");
const express = require("express");
const Season = require("./models/Season.model");
const Team = require("./models/Team.model");
const Game = require("./models/Game.model");

// const workBook = xlsx.readFile('BoyntonEXAMPLE.xlsx');
// const workBook = xlsx.readFile('Sample Database.xlsx');
const workBook = xlsx.readFile("PAHL Fall 2022 Schedule.xlsx");

const workSheet = workBook.Sheets["Master"];

const data = xlsx.utils.sheet_to_json(workSheet);

function generateRandomPassword(length) {
  let result = "";
  let characters = "0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const newSeason = {
  seasonName: "Fall 2022",
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
    date: game.date,
    time: game.time,
    location: game.location,
    division: game.division,
  };

  allGames.push(newGame);
});

console.log(allGames);
