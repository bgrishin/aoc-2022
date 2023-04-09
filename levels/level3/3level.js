const fs = require("fs");

const ABC = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const backpackItems = fs
  .readFileSync("backpack-items.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const result = backpackItems
  .map((item) => {
    const [first, second] = [
      item.slice(0, item.length / 2),
      item.slice(item.length / 2, item.length),
    ];

    const intersection = first
      .split("")
      .filter((element) => second.split("").includes(element))
      .slice(0, 1)
      .join("");

    const priority = ABC.indexOf(intersection) + 1;
    return priority;
  })
  .reduce((partialSum, a) => partialSum + a, 0);

console.log(result); // part 1
