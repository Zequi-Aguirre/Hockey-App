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
const filterLinks = document.querySelectorAll(".filter-buttons");
const allDates = document.querySelectorAll(".date-container");
// console.log(games);

if (searchInput) {
  searchInput.addEventListener("keyup", (event) => {
    const searchValue = event.target.value.toLowerCase();
    // console.log(event.target.value);
    // console.log(cellInTable.textContent.includes(searchValue));

    // console.log(searchValue);

    allDates.forEach((date) => {
      date.style.display = "inline-block";
    });
    //
    //
    //
    //

    //
    //
    //

    allGames.forEach((game) => {
      // let nameColumn = game.querySelectorAll(".gameInfo")[0];
      let allColumns = game.querySelectorAll(".game-info");
      game.style.display = "flex";
      // console.log(allColumns);
      let columnsArray = [...allColumns];
      let validRow = columnsArray.some((cellInTable) => {
        // console.log(cellInTable.textContent);
        // console.log(cellInTable.textContent);

        // console.log(cellInTable.textContent.includes(searchValue));
        // console.log(cellInTable.textContent.includes(searchValue));

        return cellInTable.textContent
          .toLocaleLowerCase()
          .includes(searchValue);

        // console.log();
        // console.log(searchValue);
        // return
      });

      // console.log(validRow);
      // console.log(game);

      // cellInTable.textContent.toLowerCase().startsWith(searchValue)
      validRow ? (game.style.display = "flex") : (game.style.display = "none");
    });
    allDates.forEach((date) => {
      if (date) {
        let next = date.nextSibling.nextSibling.style.display;

        console.log(next);

        let nextUntil = function (elem, className) {
          // Setup siblings array
          let siblings = [];

          // Get the next sibling element
          elem = elem.nextElementSibling;

          // As long as a sibling exists
          while (elem) {
            // If we've reached our match, bail
            if (!elem.classList.contains(className)) break;

            // Otherwise, push it to the siblings array
            siblings.push(elem);

            // Get the next sibling element
            elem = elem.nextElementSibling;
          }

          return siblings;
        };

        let nextnext = nextUntil(date, "game-container").some((game) => {
          return game.style.display === "flex";
        });

        // while (
        //   date.nextSibling.nextSibling.nextSibling.nextSibling.classList.contains(
        //     "game-container"
        //   )
        // ) {
        //   console.log("ok");
        // }

        if (next === "none" && !nextnext) {
          date.style.display = "none";
        }
      }
    });
  });
}

[...filterLinks].map((link) => {
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

// divisionSelector.addEventListener("change", () => {
//   allGames.forEach((game) => {
//     game.classList.remove("hide-container");
//   });

//   allGames.forEach((game) => {
//     game.classList.add("hide-container");
//   });

//   const pickedDivision = divisionSelector.value;

//   if (pickedDivision === "all") {
//     allGames.forEach((game) => {
//       game.classList.remove("hide-container");
//     });
//   } else {
//     document.querySelectorAll(`.${pickedDivision}`).forEach((game) => {
//       game.classList.remove("hide-container");
//     });
//   }
// });
