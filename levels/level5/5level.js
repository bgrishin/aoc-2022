const fs = require("fs");

const initalCrates = [
  ["J", "H", "P", "M", "S", "F", "N", "V"],
  ["S", "R", "L", "M", "J", "D", "Q"],
  ["N", "Q", "D", "H", "C", "S", "W", "B"],
  ["R", "S", "C", "L"],
  ["M", "V", "T", "P", "F", "B"],
  ["T", "R", "Q", "N", "C"],
  ["G", "V", "R"],
  ["C", "Z", "S", "P", "D", "L", "R"],
  ["D", "S", "J", "V", "G", "P", "B", "F"],
];

const initalCrates2 = [
  ["J", "H", "P", "M", "S", "F", "N", "V"],
  ["S", "R", "L", "M", "J", "D", "Q"],
  ["N", "Q", "D", "H", "C", "S", "W", "B"],
  ["R", "S", "C", "L"],
  ["M", "V", "T", "P", "F", "B"],
  ["T", "R", "Q", "N", "C"],
  ["G", "V", "R"],
  ["C", "Z", "S", "P", "D", "L", "R"],
  ["D", "S", "J", "V", "G", "P", "B", "F"],
];

const crateMoves = fs
  .readFileSync("crates.txt", "utf8")
  .split("\n")
  .filter((x) => x)
  .map((x) => x.match(/(\d+)/g).map((x) => +x));

crateMoves.map((move) => {
  const [amount, from, to] = move;
  const crates = initalCrates[from - 1]
    .splice(
      initalCrates[from - 1].length - amount,
      initalCrates[from - 1].length
    )
    .reverse();
  initalCrates[to - 1].push(...crates);
});

console.log(initalCrates.map((x) => x.join(" ")).join("\n")); // part 1

console.log(); // \n

crateMoves.map((move) => {
  const [amount, from, to] = move;
  const crates = initalCrates2[from - 1].splice(
    initalCrates2[from - 1].length - amount,
    initalCrates2[from - 1].length
  );
  initalCrates2[to - 1].push(...crates);
});

console.log(initalCrates2.map((x) => x.join(" ")).join("\n")); // part 2
