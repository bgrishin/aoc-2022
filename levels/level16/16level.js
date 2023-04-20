const fs = require("fs");

let pressureValves = fs
  .readFileSync("pressure-valves.txt", "utf8")
  .split("\n")
  .filter(Boolean);

const valves = {};
const tunnels = {};

const distances = {};
const full = [];

const storage = {};

const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((_, i) => start + i);
};

pressureValves.forEach((l) => {
  let [valve, flow, , , , targets] = l
    .match(
      /^Valve (.*) has flow rate=(.*); (tunnel|tunnels) (lead|leads) to (valve|valves) (.*)$/
    )
    .slice(1, 7);

  flow = +flow;
  targets = targets.split(", ");

  valves[valve] = flow;
  tunnels[valve] = targets;
});

for (const valve of Object.keys(valves)) {
  const start = valve === "AA";

  if (!start && !valves[valve]) continue;

  if (!start) full.push(valve);

  distances[valve] = {
    AA: 0,
  };

  const known = new Set([valve]);

  const stack = [[0, valve]];

  while (stack.length) {
    const [d, pos] = stack.shift();
    for (const neighbor of tunnels[pos]) {
      if (known.has(neighbor)) continue;
      known.add(neighbor);
      if (valves[neighbor]) distances[valve][neighbor] = d + 1;
      stack.push([d + 1, neighbor]);
    }
  }

  if (!start) delete distances[valve].AA;
}

const indices = full.reduce((acc, e, i) => {
  acc[e] = i;
  return acc;
}, {});

const calculateDepth = (remainingTime, currentValve, visitedValvesMap) => {
  const key = JSON.stringify([remainingTime, currentValve, visitedValvesMap]);
  if (storage[key]) return storage[key];
  let max = 0;
  for (const adjacent of Object.keys(distances[currentValve])) {
    if (visitedValvesMap & (1 << indices[adjacent])) continue;
    const rt = remainingTime - distances[currentValve][adjacent] - 1;
    if (rt <= 0) continue;
    max = Math.max(
      max,
      calculateDepth(
        rt,
        adjacent,
        visitedValvesMap | (1 << indices[adjacent])
      ) +
        valves[adjacent] * rt
    );
  }
  storage[key] = max;
  return max;
};

console.log(calculateDepth(30, "AA", 0)); // part 1

const firstElement = (1 << full.length) - 1;

const result2 = range(0, Math.floor((firstElement + 1) / 2)).reduce(
  (acc, n) =>
    (acc = Math.max(
      acc,
      calculateDepth(26, "AA", n) + calculateDepth(26, "AA", firstElement ^ n)
    )),
  0
);

console.log(result2); // part 2
