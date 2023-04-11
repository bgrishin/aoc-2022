const fs = require("fs");

const moves = fs
  .readFileSync("bridge-moves.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const head = [0, 0];
const tail = [0, 0];

const uniqueTailPositions = new Set(["0,0"]);

const moveHead = (direction) => {
  if (direction === "L") head[0]--;
  if (direction === "U") head[1]++;
  if (direction === "R") head[0]++;
  if (direction === "D") head[1]--;
};

const areTouching = (distance) => distance.every((x) => Math.abs(x) <= 1);

const moveTail = () => {
  const distance = [tail[0] - head[0], tail[1] - head[1]];
  if (areTouching(distance)) return;

  tail[0] -= Math.sign(distance[0]);
  tail[1] -= Math.sign(distance[1]);

  uniqueTailPositions.add(tail.join(","));
};

moves.forEach((movement) => {
  const [direction, amount] = movement.split(" ");

  for (let i = 0; i < +amount; i++) {
    moveHead(direction);
    moveTail();
  }
});

const result = uniqueTailPositions.size;

console.log(result); // part 1
