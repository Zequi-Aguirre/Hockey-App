document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Hockey-App JS imported successfully!");
  },
  false
);

// console.log();

const searchInput = document.querySelector("#search");
const allGames = document.querySelectorAll(".game-container");
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
        let dayGames = gameDay.querySelectorAll(".game-container");
        dayGames.forEach((game) => {
          game.style.display = "flex";
        });
      });
    } else {
      gameDayContainers.forEach((gameDay) => {
        gameDay.style.display = "block";
        let dayGames = gameDay.querySelectorAll(".game-container");
        dayGames.forEach((game) => {
          game.style.display = "flex";
        });
        let count = 0;
        dayGames.forEach((game) => {
          if (!game.classList.contains(gamesFilter.value)) {
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
        let dayGames = gameDay.querySelectorAll(".game-container");
        dayGames.forEach((game) => {
          game.style.display = "flex";
        });
      });
      console.log(searchValue);
    } else {
      // -=--=-==-=-=-=--=-=-=--=-==-=-=-=--=-= new start

      gameDayContainers.forEach((gameDay) => {
        gameDay.style.display = "block";
        let dayGames = gameDay.querySelectorAll(".game-container");
        dayGames.forEach((game) => {
          game.style.display = "flex";
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
        game.style.display = "flex";
        // console.log(game);

        if (searchInput.value === "all") {
          game.style.display = "flex";
        } else if (
          !game.classList.contains(link.getAttribute("data-searchdata"))
        ) {
          game.style.display = "none";
        }
      });
    });
  });
}

const adminRoutesDiv = document.querySelector("#admin-routes");
const adminRoutesButton = document.querySelector("#admin-routes-button");
adminRoutesDiv.classList.add("admin-routes-hide");

adminRoutesButton.addEventListener("click", () => {
  // console.log(adminRoutesDiv);
  adminRoutesDiv.classList.toggle("admin-routes-hide");
});
