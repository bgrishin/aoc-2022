const fs = require("fs");

const count = (arr, condition) => arr.filter(condition).length;
const common = (a, b) => a.filter((e) => b.includes(e));

const coords = fs
  .readFileSync("coords.txt", "utf8")
  .split("\n")
  .filter(Boolean)
  .map((x) => x.split(",").map(Number));

const between = (a, b, c) => a <= b && b <= c;
const bounds = 99999;

const offset = [
  { x: 0, y: 0, z: 0.5 },
  { x: 0, y: 0, z: -0.5 },
  { x: 0.5, y: 0, z: 0 },
  { x: -0.5, y: 0, z: 0 },
  { x: 0, y: 0.5, z: 0 },
  { x: 0, y: -0.5, z: 0 },
];

let minX = bounds;
let minY = bounds;
let minZ = bounds;

let maxX = -bounds;
let maxZ = -bounds;
let maxY = -bounds;

const sides = {};
const lava = new Set();

coords.forEach((coords) => {
  const [x, y, z] = coords;
  lava.add(JSON.stringify([x, y, z]));

  minX = Math.min(minX, x);
  minY = Math.min(minY, y);
  minZ = Math.min(minZ, z);
  maxX = Math.max(maxX, x);
  maxY = Math.max(maxY, y);
  maxZ = Math.max(maxZ, z);

  offset.forEach((o) => {
    const { x: ox, y: oy, z: oz } = o;
    const point = JSON.stringify([x + ox, y + oy, z + oz]);
    if (!sides[point]) sides[point] = 0;
    sides[point]++;
  });
});

const result = count(Object.values(sides), (e) => e === 1);

console.log(result); // part 1

const stack = [{ x: minX, y: minY, z: minZ }];
const emptySpace = new Set();
emptySpace.add(JSON.stringify([minX, minY, minZ]));

while (stack.length) {
  const { x, y, z } = stack.shift();
  for (const { x: ox, y: oy, z: oz } of offset) {
    const bx = x + ox * 2;
    const by = y + oy * 2;
    const bz = z + oz * 2;

    const point = JSON.stringify([bx, by, bz]);
    if (
      !(
        between(minX - 1, bx, maxX + 1) &&
        between(minY - 1, by, maxY + 1) &&
        between(minZ - 1, bz, maxZ + 1)
      )
    )
      continue;
    if (lava.has(point) || emptySpace.has(point)) continue;
    emptySpace.add(point);
    stack.push({ x: bx, y: by, z: bz });
  }
}

const freeSpace = new Set();

emptySpace.forEach((e) => {
  const [x, y, z] = JSON.parse(e);
  offset.forEach((o) => {
    const { x: dx, y: dy, z: dz } = o;
    freeSpace.add(JSON.stringify([x + dx, y + dy, z + dz]));
  });
});

const result2 = common(Object.keys(sides), [...freeSpace]).length;

console.log(result2);
