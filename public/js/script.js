document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Hockey-App JS imported successfully!");
  },
  false
);

// console.log();

const searchInput = document.querySelector("#search");
const allGames = document.querySelectorAll(".game-container-link");
// const games = document.querySelectorAll("tbody tr");
const adminFilterLinks = document.querySelectorAll(".admin-filter-buttons");
const allDates = document.querySelectorAll(".date-container");
const adminSections = document.querySelectorAll(".admin-section");
// console.log(games);

// -=-=-=--=--=-=-=-=-=-=--=-=-=-==-==-=--==-=-==-=-=

const gamesFilter = document.querySelector("#gamesFilter");
const gameDayContainers = document.querySelectorAll(".game-day-container");

// -=-=-=--=--=-=-=-=-=-=--=-=-=-==-==-=--==-=-==-=-=

if (gamesFilter) {
  gamesFilter.addEventListener("change", () => {
    console.log(gamesFilter.value);
    if (gamesFilter.value === "all") {
      gameDayContainers.forEach((gameDay) => {
        gameDay.style.display = "block";
        let dayGames = gameDay.querySelectorAll("a");
        dayGames.forEach((game) => {
          game.style.display = "inline-block";
        });
      });
    } else {
      gameDayContainers.forEach((gameDay) => {
        // console.log({ gameDayContainers });
        gameDay.style.display = "block";
        let dayGames = gameDay.querySelectorAll("a");
        dayGames.forEach((game) => {
          console.log({ game });
          game.style.display = "inline-block";
        });
        let count = 0;
        dayGames.forEach((game) => {
          let gameDiv = game.querySelector("div");
          if (!gameDiv.classList.contains(gamesFilter.value)) {
            game.style.display = "none";
            count++;
          }
        });
        if (count === dayGames.length) {
          gameDay.style.display = "none";
        }
        console.log(dayGames.length);
      });
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("keyup", (event) => {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue.length < 1) {
      gameDayContainers.forEach((gameDay) => {
        gameDay.style.display = "block";
        console.log(gameDay);
        let dayGames = gameDay.querySelectorAll("a");
        console.log(dayGames);
        dayGames.forEach((game) => {
          game.style.display = "inline-block";
        });
      });
      console.log(searchValue);
    } else {
      // -=--=-==-=-=-=--=-=-=--=-==-=-=-=--=-= new start

      gameDayContainers.forEach((gameDay) => {
        gameDay.style.display = "block";
        let dayGames = gameDay.querySelectorAll("a");
        dayGames.forEach((game) => {
          game.style.display = "inline-block";
        });
        let count = 0;
        dayGames.forEach((game) => {
          console.log(typeof game.textContent);
          console.log(game.textContent);
          console.log(searchInput.value);
          console.log(game.textContent.includes(searchInput.value));

          if (!game.textContent.toLowerCase().includes(searchInput.value)) {
            game.style.display = "none";
            count++;
          }
        });
        if (count === dayGames.length) {
          gameDay.style.display = "none";
        }
        // console.log(dayGames.length);
      });

      // });
    }
    // console.log(event.target.value);
    // console.log(cellInTable.textContent.includes(searchValue));

    // console.log(searchValue);
  });
}

if (gamesFilter) {
  [...gamesFilter].map((link) => {
    link.addEventListener("click", () => {
      searchInput.value = link.getAttribute("data-searchdata");

      console.log(link.getAttribute("data-searchdata"));

      allGames.forEach((game) => {
        game.style.display = "inline-block";
        // console.log(game);

        if (searchInput.value === "all") {
          game.style.display = "inline-block";
        } else if (
          !game.classList.contains(link.getAttribute("data-searchdata"))
        ) {
          game.style.display = "none";
        }
      });
    });
  });
}

let adminOptions = document.querySelectorAll(".admin");

const menuButton = document.querySelector("#menu-button");
const closeMenuButton = document.querySelector("#close-side-menu");
const overlayDiv = document.querySelector(".overlay");

overlayDiv.style.display = "none";

if (overlayDiv) {
  overlayDiv.addEventListener("click", (event) => {
    console.log(event.target);
    overlayDiv.style.display = "none";
    document.querySelector("#side-menu").style.display = "none";
  });
}

menuButton.addEventListener("click", (event) => {
  console.log(event.target);
  overlayDiv.style.display = "block";

  document.querySelector("#side-menu").style.display = "block";
});

closeMenuButton.addEventListener("click", (event) => {
  console.log(event.target);
  document.querySelector("#side-menu").style.display = "none";
  overlayDiv.style.display = "none";
});

if (adminOptions.length > 0) {
  // const adminRoutesDiv = document.querySelector("#admin-routes");
  const adminRoutesButton = document.querySelector("#admin-routes-button");

  adminOptions.forEach((option) => {
    option.classList.add("admin-routes-hide");
  });

  adminRoutesButton.addEventListener("click", () => {
    // console.log(adminRoutesDiv);

    adminOptions.forEach((option) => {
      option.classList.toggle("admin-routes-hide");
    });
    // adminRoutesDiv.classList.toggle("admin-routes-hide");
  });
}

const profilePicture = document.querySelector("#profile-picture");

let profilePictureList = ["/images/blue-player.jpg", "/images/red-player.jpg"];

let randomPicture =
  profilePictureList[Math.floor(Math.random() * profilePictureList.length)];

profilePicture.src = randomPicture;

let playersInTeam = document.querySelectorAll(".playerTeamDetailsView");

const playerDataCard = document.querySelector("#playerDataCardTeamPage");
const playerData = document.querySelector("#playerData");

const playerJerseyNumber = document.querySelector("#jerseyNumber");
const playerEmailAddress = document.querySelector("#emailAddress");
const playerPhoneNumber = document.querySelector("#phoneNumber");

const playerName = playerDataCard
  .querySelector("#playerNamePic")
  .querySelector("h1");

playersInTeam.forEach((player) => {
  // console.log(player);
  player.addEventListener("mouseover", (event) => {
    let hoverPlayer = event.target.dataset;

    // console.log({ data: hoverPlayer });
    if (hoverPlayer.name) {
      playerName.innerText = `${hoverPlayer.name} ${hoverPlayer.lastname}`;
      playerJerseyNumber.innerText = `#${hoverPlayer.jerseynumber}`;
      playerEmailAddress.innerText = `${hoverPlayer.emailaddress}`;
      playerPhoneNumber.innerText = `${hoverPlayer.phonenumber}`;
    }
    // console.log(hoverPlayer.jerseynumber);
  });
});
