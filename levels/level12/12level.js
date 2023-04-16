const fs = require("fs");

let heightMap = fs
  .readFileSync("height-map.txt", "utf8")
  .split("\n")
  .filter(Boolean);

const landscape = heightMap.flatMap((i) =>
  i.split("").map((j) => j.charCodeAt(0))
);

const start = landscape.findIndex((i) => i === "S".charCodeAt(0));
const end = landscape.findIndex((i) => i === "E".charCodeAt(0));

landscape[start] = "a".charCodeAt(0);
landscape[end] = "z".charCodeAt(0);

const countSteps = (start) => {
  let queue = [[start, 0]];
  const cache = new Set([start]);
  while (queue.length) {
    const [pos, steps] = queue.shift();
    if (pos === end) return steps;
    const res = [
      heightMap[0].length + pos,
      -heightMap[0].length + pos,
      1 + pos,
      -1 + pos,
    ].filter((r) => landscape[r] <= landscape[pos] + 1 && !cache.has(r));
    res.forEach((r) => cache.add(r));
    queue = [...queue, ...res.map((c) => [c, steps + 1])];
  }
  return Infinity;
};

const result = countSteps(start);

console.log(result); // part 1

const result2 = landscape
  .map((char, i) => ({ char, start: i }))
  .filter(({ char }) => char === "a".charCodeAt(0))
  .map(({ start }) => countSteps(start))
  .reduce((min, v) => (min < v ? min : v));

console.log(result2 === Infinity ? "No path found" : result2); // part 2
