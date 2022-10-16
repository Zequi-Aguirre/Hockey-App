console.log("all games connected");

let allGamesContainers = document.querySelectorAll(
  ".game-container-details-hover"
);

// if (allGamesContainers.length > 0) {
//   allGamesContainers.forEach((game) => {
//     game.addEventListener("click", (event) => {
//       console.log(event.target.id);
//       window.location = `localhost:3000/team/team-detail/${event.target.id}`;
//     });
//   });
// }

const timeSelector = document.querySelector("#time");
const locationSelector = document.querySelector("#location");
const divisionSelector = document.querySelector("#division");
const teamsInDivision = document.querySelectorAll("#teamsInDivision > li");
const homeTeamSelector = document.querySelector("#homeTeam");
const awayTeamSelector = document.querySelector("#awayTeam");

if (homeTeamSelector) {
  console.log("homeTeamSelector");
  teamsInDivision.forEach((team) => {
    let idForLI = team.dataset.teamid;
    team = team.innerHTML;

    console.log(idForLI);
    // homeTeamSelector.innerHTML = ``;
    homeTeamSelector.innerHTML += `<option value='${idForLI}'>${team}</option>`;
  });
  console.log(homeTeamSelector);
  let teamSelectorOptionsHome = homeTeamSelector.querySelectorAll("option");
  const selectedTeam = homeTeamSelector.dataset.hometeam;

  // const selectedRink = locationSelector.dataset.rink;
  console.log(teamSelectorOptionsHome);

  teamSelectorOptionsHome.forEach((option) => {
    console.log(option.value);
    console.log(selectedTeam);
    console.log(option.value === selectedTeam);

    if (option.value === selectedTeam) {
      option.setAttribute("selected", true);
    }
  });
}

if (awayTeamSelector) {
  console.log("awayTeamSelector");
  teamsInDivision.forEach((team) => {
    let idForLI2 = team.dataset.teamid;
    team = team.innerHTML;
    console.log(idForLI2);
    // homeTeamSelector.innerHTML = ``;
    awayTeamSelector.innerHTML += `<option value='${idForLI2}'>${team}</option>`;
  });
  console.log(awayTeamSelector);
  let teamSelectorOptionsAway = awayTeamSelector.querySelectorAll("option");
  const selectedTeam = awayTeamSelector.dataset.awayteam;
  console.log(teamSelectorOptionsAway);

  teamSelectorOptionsAway.forEach((option) => {
    // console.log(option.innerHTML);
    // console.log(option.value);
    if (option.value === selectedTeam) {
      option.setAttribute("selected", true);
    }
  });
}

if (teamsInDivision) {
  // console.log(teamsInDivision);
  teamsInDivision.forEach((team) => {
    // console.log(team.innerHTML);
  });
}

if (timeSelector) {
  const timeFromDB = timeSelector.dataset.unformatedtime;

  const hourFromDB = timeFromDB.split(":")[0];
  const minFromDB = timeFromDB.split(":")[1].substring(0, 2);
  const AMPMFromDB = timeFromDB.split(":")[1].substring(2);

  console.log(hourFromDB);
  console.log(minFromDB);
  console.log(AMPMFromDB);

  console.log(timeFromDB);

  const hourSelector = timeSelector
    .querySelector("#hour")
    .querySelectorAll("option");
  const minutesSelector = timeSelector
    .querySelector("#minutes")
    .querySelectorAll("option");
  const ampmSelector = timeSelector
    .querySelector("#am-pm")
    .querySelectorAll("option");

  hourSelector.forEach((option) => {
    if (option.value === hourFromDB) {
      option.setAttribute("selected", true);
    }
  });
  minutesSelector.forEach((option) => {
    if (option.value === minFromDB) {
      option.setAttribute("selected", true);
    }
  });
  ampmSelector.forEach((option) => {
    if (option.value === AMPMFromDB) {
      option.setAttribute("selected", true);
    }
  });
}
if (locationSelector) {
  let rinkSelector = locationSelector.querySelectorAll("option");
  const selectedRink = locationSelector.dataset.rink;
  console.log(selectedRink);

  rinkSelector.forEach((option) => {
    if (option.value === selectedRink) {
      option.setAttribute("selected", true);
    }
  });
}

if (divisionSelector) {
  let divisionOptions = divisionSelector.querySelectorAll("option");
  const selectedRink = divisionSelector.dataset.division;
  console.log(selectedRink);

  divisionOptions.forEach((option) => {
    if (option.value === selectedRink) {
      option.setAttribute("selected", true);
    }
  });
}
