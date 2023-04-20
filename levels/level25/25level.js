const fs = require("fs");

let snafuNumbers = fs
  .readFileSync("snafu-numbers.txt", "utf8")
  .split("\n")
  .filter(Boolean);

let decimal = snafuNumbers.reduce((acc, line) => {
  let increment = 1;
  line
    .split("")
    .reverse()
    .forEach((char) => {
      acc += ("=-012".indexOf(char) - 2) * increment;
      increment *= 5;
    });
  return acc;
}, 0);

console.log("Decimal:", decimal);

let result = "";

while (decimal) {
  const r = decimal % 5;
  decimal = Math.floor(decimal / 5);
  if (r <= 2) {
    result = r + result;
  } else {
    result = "   =-"[r] + result;
    decimal++;
  }
}

console.log("Snafu:", result);

// lol
