const fs = require("fs");

let arrays = fs
  .readFileSync("arrays.txt", "utf8")
  .split("\n\n")
  .map((x) => x.split("\n"))
  .map(([a, b]) => [JSON.parse(a), JSON.parse(b)]);

const iterateArrayTree = (a, b) => {
  let i = 0;
  while (i < a.length && i < b.length) {
    if (typeof a[i] === "number" && typeof b[i] === "number") {
      if (a[i] !== b[i]) return a[i] - b[i];
    } else {
      const recursionResult = iterateArrayTree([a[i]].flat(), [b[i]].flat());
      if (recursionResult !== 0) return recursionResult;
    }
    i++;
  }
  return a.length - b.length;
};

const result = arrays.reduce((acc, [a, b], i) => {
  iterateArrayTree(a, b) < 0 ? (acc += i + 1) : null;
  return acc;
}, 0);

console.log(result); // part 1;

const dividers = [[[2]], [[6]]];
const base = [...arrays.flat(1), ...dividers];

base.sort(iterateArrayTree);

const reduceMultiply = (...args) => args.reduce((acc, val) => acc * val, 1);

console.log(reduceMultiply(...dividers.map((pkg) => base.indexOf(pkg) + 1))); // part 2
