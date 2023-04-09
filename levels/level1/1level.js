const fs = require("fs");

const elfCalories = fs.readFileSync("elf-calories.txt", "utf8");

const result = Math.max(
  ...elfCalories.split("\n\n").map((group) =>
    group
      .replaceAll("\n", " ")
      .split(" ")
      .map((x) => +x)
      .reduce((partialSum, a) => partialSum + a, 0)
  )
);

console.log(result); // part 1

const result2 = elfCalories
  .split("\n\n")
  .map((group) =>
    group
      .replaceAll("\n", " ")
      .split(" ")
      .map((x) => +x)
      .reduce((partialSum, a) => partialSum + a, 0)
  )
  .sort((a, b) => b - a)
  .slice(0, 3)
  .reduce((partialSum, a) => partialSum + a, 0);

console.log(result2); // part 2
