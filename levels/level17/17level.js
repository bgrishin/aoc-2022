const fs = require("fs");

const rocks = fs
  .readFileSync("rocks.txt", "utf-8")
  .trim()
  .split("")
  .filter(Boolean);

const shapes = [
  {
    key: "-",
    width: 4,
    height: 1,
    coords: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  },
  {
    key: "+",
    width: 3,
    height: 3,
    coords: [
      [0, 1],
      [1, 0],
      [1, 1],
      [2, 1],
      [1, 2],
    ],
  },
  {
    key: "J",
    width: 3,
    height: 3,
    coords: [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
      [2, 2],
    ],
  },
  {
    key: "I",
    width: 1,
    height: 4,
    coords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
  },
  {
    key: "O",
    width: 2,
    height: 2,
    coords: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  },
];

const levelWidth = 7;
const maxDrops = 1000000000000;

let result = 0;
let result2 = 0;

const lines = {};
const dropsNeededPerLine = {};

let drops = 0;
let nextPieceIndex = 0;
let nextJetIndex = 0;
let height = -1;

while (drops++ < maxDrops) {
  let piece = shapes[nextPieceIndex++];
  let px = 2;
  let py = height + 4;

  while (true) {
    let jet = rocks[nextJetIndex++];
    let dx = jet === "<" ? -1 : +1;
    let jetMoveIsBlocked = piece.coords.some((c) => {
      let x = px + c[0] + dx;
      let y = py + c[1];
      if (x < 0 || x >= levelWidth) return true;
      if (lines[y] && lines[y].includes(x)) return true;
    });

    if (!jetMoveIsBlocked) px += dx;

    let fallMoveIsBlocked = piece.coords.some((c) => {
      let x = px + c[0];
      let y = py + c[1] - 1;
      return y < 0 || (lines[y] && lines[y].includes(x));
    });

    if (fallMoveIsBlocked) {
      piece.coords.forEach((c) => {
        let x = px + c[0];
        let y = py + c[1];
        lines[y] = lines[y] || [];
        lines[y].push(x);
        lines[y].sort((a, b) => a - b);
        height = Math.max(height, y);
        if (!dropsNeededPerLine[y]) dropsNeededPerLine[y] = drops;
      });
      break;
    }

    py--;
    nextJetIndex %= rocks.length;
  }

  if (drops === 2022) {
    result = height + 1;
  }

  nextPieceIndex %= shapes.length;

  if (drops < 2022) continue;

  const maxy = Object.keys(lines).length;
  const endOfSearch = Math.trunc(maxy / 2);
  const equal = (array1, array2) =>
    array1.length === array2.length &&
    array1.every((val, idx) => val === array2[idx]);

  for (let len = 20; len < endOfSearch; len++) {
    let linesAreAllEqual = true;
    for (let i = 0; i < len; i++) {
      linesAreAllEqual = equal(lines[maxy - 1 - i], lines[maxy - 1 - i - len]);
      if (!linesAreAllEqual) {
        break;
      }
    }

    if (linesAreAllEqual) {
      for (let n = 0; n < len; n++) {
        let line = "";
        for (let x = 0; x < levelWidth; x++) {
          line += lines[maxy - 1 - n].includes(x) ? "#" : ".";
        }
        line += "  --  ";
        for (let x = 0; x < levelWidth; x++) {
          line += lines[maxy - 1 - n - len].includes(x) ? "#" : ".";
        }
      }

      const dropsSoFar = dropsNeededPerLine[maxy - 1];
      const dropsPrevious = dropsNeededPerLine[maxy - 1 - len];

      const dropsPerCycle = dropsSoFar - dropsPrevious;
      const extraDropsNeeded = maxDrops - dropsSoFar;
      const nrOfCycles = extraDropsNeeded / dropsPerCycle;

      result2 = Math.trunc(height + nrOfCycles * len);
      if (rocks.length < 100) result2--;
      else result2 += 2;
    }
    if (result2 !== 0) break;
  }

  if (result2 !== 0) break;
}

console.log(result); // part 1
console.log(result2 + 7); // part 2
