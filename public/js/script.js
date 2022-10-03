document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("Hockey-App JS imported successfully!");
  },
  false
);

console.log();

const divisionSelector = document.querySelector("#divison-selector");
const allGames = document.querySelectorAll(".game-container");

divisionSelector.addEventListener("change", () => {
  allGames.forEach((game) => {
    game.classList.remove("hide-container");
  });

  allGames.forEach((game) => {
    game.classList.add("hide-container");
  });

  const pickedDivision = divisionSelector.value;

  if (pickedDivision === "all") {
    allGames.forEach((game) => {
      game.classList.remove("hide-container");
    });
  } else {
    document.querySelectorAll(`.${pickedDivision}`).forEach((game) => {
      game.classList.remove("hide-container");
    });
  }
});
