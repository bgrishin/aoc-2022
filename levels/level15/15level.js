const fs = require("fs");

const difference = (a, b) => [...a].filter((x) => [...b].indexOf(x) < 0);

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((_, i) => start + i);
};

let sensorMap = fs
  .readFileSync("sensors.txt", "utf8")
  .split("\n")
  .filter(Boolean)
  .map((l) => {
    return l
      .match(
        /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/
      )
      .slice(1, 5)
      .map(Number);
  });

const calculatePositions = (offset = 2000000) => {
  const intervals = [];
  const visited = new Set();
  sensorMap.forEach(([sensorX, sensorY, beaconX, beaconY]) => {
    const distance = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    const difference = distance - Math.abs(sensorY - offset);
    if (difference >= 0) {
      intervals.push({ x: sensorX - difference, y: sensorX + difference });
      if (beaconY === offset) {
        visited.add(beaconX);
      }
    }
  });

  intervals.sort((a, b) => a.x - b.x);

  let mergedIntervals = [];
  let lastEnd = -Infinity;

  intervals.forEach((interval) => {
    if (interval.x <= lastEnd) {
      const lastInterval = mergedIntervals[mergedIntervals.length - 1];
      lastInterval.y = Math.max(lastInterval.y, interval.y);
      lastEnd = lastInterval.y;
    } else {
      mergedIntervals.push(interval);
      lastEnd = interval.y;
    }
  });

  return { intervals, visited, mergedIntervals };
};

const { intervals, visited } = calculatePositions();

const prohibited = intervals.reduce((result, { x, y }) => {
  const rangeValues = range(x, y);
  rangeValues.forEach((n) => result.add(n));
  return result;
}, new Set());

const result = difference(prohibited, visited).length;

console.log(result); // part 1

let found = false;
let result2 = false;

const max = 4000000;

for (const n of range(0, max)) {
  if (found) break;
  const { mergedIntervals } = calculatePositions(n);
  let res = 0;
  for (const { x, y } of mergedIntervals) {
    if (res < x) {
      result2 = res * max + n;
      found = true;
      break;
    }
    res = Math.max(res, y + 1);
    if (res > max) break;
  }
}

console.log(result2); // part 2
