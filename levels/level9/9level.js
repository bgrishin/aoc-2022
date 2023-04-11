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

moves.map((move) => {
  const [direction, amount] = move.split(" ");

  for (let i = 0; i < +amount; i++) {
    moveHead(direction);
    moveTail();
  }
});

const result = uniqueTailPositions.size;

console.log(result); // part 1

const body = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

const bodyHead = body[0];
const bodyTail = body[body.length - 1];
const uniqueBodyTailPositions = new Set(["0,0"]);

const moveBodyHead = (direction) => {
  if (direction === "L") bodyHead[0]--;
  if (direction === "U") bodyHead[1]++;
  if (direction === "R") bodyHead[0]++;
  if (direction === "D") bodyHead[1]--;
};

const moveBody = (bodyPart) => {
  const prev = body[body.indexOf(bodyPart) - 1];
  const distance = [bodyPart[0] - prev[0], bodyPart[1] - prev[1]];
  if (areTouching(distance)) return;

  bodyPart[0] -= Math.sign(distance[0]);
  bodyPart[1] -= Math.sign(distance[1]);

  bodyPart === bodyTail
    ? uniqueBodyTailPositions.add(bodyPart.join(","))
    : null;
};

moves.map((move) => {
  const [direction, amount] = move.split(" ");

  for (let i = 0; i < +amount; i++) {
    moveBodyHead(direction);
    for (let j = 1; j < 10; j++) {
      moveBody(body[j]);
    }
  }
});

console.log(uniqueBodyTailPositions.size); // part 2
