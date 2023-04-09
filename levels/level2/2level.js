const fs = require("fs");

const SCORES = {
  tools: {
    R: 1,
    P: 2,
    S: 3,
  },
  wins: {
    lose: 0,
    draw: 3,
    win: 6,
  },
};

const TURNS = {
  A: "R",
  B: "P",
  C: "S",
  X: "R",
  Y: "P",
  Z: "S",
};

const KILL_COMBINATIONS = {
  R: "P",
  P: "S",
  S: "R",
};

const LOSE_COMBINATIONS = {
  R: "S",
  P: "R",
  S: "P",
};

const rspCheats = fs
  .readFileSync("rsp-cheats.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const results = rspCheats
  .map((cheat) => {
    const [player1, player2] = cheat.split(" ");

    if (KILL_COMBINATIONS[TURNS[player1]] === TURNS[player2]) {
      return SCORES.tools[TURNS[player2]] + SCORES.wins.win;
    } else if (KILL_COMBINATIONS[TURNS[player2]] === TURNS[player1]) {
      return SCORES.wins.lose + SCORES.tools[TURNS[player2]];
    } else {
      return SCORES.wins.draw + SCORES.tools[TURNS[player2]];
    }
  })
  .reduce((partialSum, a) => partialSum + a, 0);

console.log(results); // part 1

const results2 = rspCheats
  .map((cheat) => {
    const [player2, expectedOver] = cheat.split(" ");

    if (expectedOver === "X") {
      return SCORES.wins.lose + SCORES.tools[LOSE_COMBINATIONS[TURNS[player2]]];
    } else if (expectedOver === "Y") {
      return SCORES.wins.draw + SCORES.tools[TURNS[player2]];
    } else if (expectedOver === "Z") {
      return SCORES.tools[KILL_COMBINATIONS[TURNS[player2]]] + SCORES.wins.win;
    }
  })
  .reduce((partialSum, a) => partialSum + a, 0);

console.log(results2); // part 2
