const fs = require("fs");

const pathsParsed = fs
  .readFileSync("paths.txt", "utf8")
  .split("\n")
  .filter(Boolean)
  .map((line) =>
    line.split(" -> ").map((coords) => coords.split(",").map(Number))
  );

const maxX = Math.max(...pathsParsed.flat().map(([x]) => x)) * 2;
const maxY = Math.max(...pathsParsed.flat().map(([_, y]) => y));

const simulateSand = (cave, secondPart = false) => {
  let x = 500;
  let y = 0;
  let next = false;
  while (true) {
    if (y > maxY + 1) {
      next = true;
      break;
    }
    if (cave[y + 1][x] === 0) {
      y++;
      continue;
    }
    if (cave[y + 1][x - 1] === 0) {
      y++;
      x--;
      continue;
    }
    if (cave[y + 1][x + 1] === 0) {
      y++;
      x++;
      continue;
    }
    break;
  }
  cave[y][x] = 2;
  return secondPart ? y === 0 : next;
};

const buildWall = (cave, from, to) => {
  const [fromX, fromY] = from;
  const [toX, toY] = to;
  const [minX, minY] = [Math.min(fromX, toX), Math.min(fromY, toY)];
  const [maxX, maxY] = [Math.max(fromX, toX), Math.max(fromY, toY)];
  for (let i = minX; i <= maxX; i++)
    for (let j = minY; j <= maxY; j++) cave[j][i] = 1;
};

let cave = JSON.parse(
  JSON.stringify(new Array(maxY + 3).fill(new Array(maxX).fill(0)))
);

let result = 0;

pathsParsed.forEach((coords) => {
  coords.forEach((path, i) => {
    if (i !== 0) buildWall(cave, coords[i - 1], path);
  });
});

while (!simulateSand(cave)) result++;

console.log(result); // part 1

let result2 = 1;

cave = JSON.parse(
  JSON.stringify(new Array(maxY + 3).fill(new Array(maxX).fill(0)))
);

[
  ...pathsParsed,
  [
    [0, maxY + 2],
    [maxX * 2, maxY + 2], // just add floor, that was easy)
  ],
].forEach((coords) =>
  coords.forEach((path, i) => {
    if (i !== 0) buildWall(cave, coords[i - 1], path);
  })
);

while (!simulateSand(cave, true)) result2++;
console.log(result2);
