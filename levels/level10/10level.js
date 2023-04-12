const fs = require("fs");

let signals = fs
  .readFileSync("cpu-signals.txt", "utf8")
  .split("\n")
  .filter((x) => x);

let cycle = 0;
let x = 1;
let result = 0;

const observedCycles = [20, 60, 100, 140, 180, 220];

const tick = (count) => {
  for (let i = 0; i < count; i++) {
    cycle++;
    if (observedCycles.includes(cycle)) result += cycle * x;
  }
};

while (signals.length) {
  const signal = signals.shift();

  if (signal === "noop") {
    tick(1);
    continue;
  }

  const amount = signal.match(/-?\d+/);

  tick(2);
  x += +amount;
}

console.log(result); // part 1

signals = fs
  .readFileSync("cpu-signals.txt", "utf8")
  .split("\n")
  .filter((x) => x);
cycle = 0;
x = 1;

const textTick = (count) => {
  for (let i = 0; i < count; i++) {
    const pixel = [x - 1, x, x + 1].includes(cycle % 40) ? "#" : ".";
    cycle++;
    const displaySpaceEnds = cycle % 40 === 0;
    process.stdout.write(
      new TextEncoder().encode(`${pixel}${displaySpaceEnds ? "\n" : ""}`)
    );
  }
};

while (signals.length) {
  const signal = signals.shift();

  if (signal === "noop") {
    textTick(1);
    continue;
  }

  const amount = signal.match(/-?\d+/);

  textTick(2);
  x += +amount;
}

// part 2, result will be displayed in the terminal
