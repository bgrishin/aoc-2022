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

console.log(result);
