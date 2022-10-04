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
const games = document.querySelectorAll("tbody tr");

// console.log(games);

searchInput.addEventListener("keyup", (event) => {
  const searchValue = event.target.value.toLowerCase();
  // console.log(event.target.value);
  // console.log(cellInTable.textContent.includes(searchValue));

  console.log(`
    
    
    
    
    
    
    
    
    
    
    
    
    validRow
    
    
    
    
    
    
    
    
    
    `);
  console.log(searchValue);
  //
  //
  //
  //

  //
  //
  //

  allGames.forEach((game) => {
    // let nameColumn = game.querySelectorAll(".gameInfo")[0];
    let allColumns = game.querySelectorAll(".gameInfo");
    game.style.display = "table-row";
    // console.log(allColumns);
    let columnsArray = [...allColumns];
    let validRow = columnsArray.some((cellInTable) => {
      // console.log(cellInTable.textContent);
      // console.log(cellInTable.textContent);
      console.log(`
    
    
    
    
    
    
    
    
    
    
    
    
    validRow
    
    
    
    
    
    
    
    
    
    `);
      console.log(searchValue);
      console.log(cellInTable.textContent.includes(searchValue));
      console.log(cellInTable.textContent);
      // console.log(cellInTable.textContent.includes(searchValue));
      // console.log(cellInTable.textContent.includes(searchValue));

      if (
        cellInTable.textContent.toLocaleLowerCase().includes(searchValue) <= 0
      ) {
        return false;
      } else {
        return true;
      }
      // console.log();
      // console.log(searchValue);
    });

    // console.log(validRow);
    // console.log(game);

    // cellInTable.textContent.toLowerCase().startsWith(searchValue)
    validRow
      ? (game.style.display = "table-row")
      : (game.style.display = "none");
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
