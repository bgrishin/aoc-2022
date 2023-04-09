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

let result2 = [];

for (let i = 0; i < 300; i += 3) {
  result2.push(backpackItems.slice(i, i + 3));
}

result2 = result2
  .map((group) => {
    const [first, second, third] = group;
    const intersection = first
      .split("")
      .filter(
        (element) =>
          second.split("").includes(element) &&
          third.split("").includes(element)
      )
      .slice(0, 1)
      .join("");

    const priority = ABC.indexOf(intersection) + 1;
    return priority;
  })
  .reduce((partialSum, a) => partialSum + a, 0);

console.log(result2); // part 2
