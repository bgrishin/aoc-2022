const fs = require("fs");

const encryptedCoords = fs
  .readFileSync("encrypted-coords.txt", "utf8")
  .split("\n")
  .filter(Boolean)
  .map((coords) => ({ left: null, value: +coords, right: null }));

const encryptedCoordsPart2 = JSON.parse(JSON.stringify(encryptedCoords)).map(
  (coords) => {
    coords.value *= 811589153; // encryption key
    return coords;
  }
);

const equals = (a, b) => {
  if (a === null || b === null) return false;
  return (
    a.value === b.value &&
    a.right.value === b.right.value &&
    a.left.value === b.left.value
  );
};

const modulo = (a, b) => ((a % b) + b) % b;

const len = encryptedCoords.length;

for (let i = 0; i < len; i++) {
  encryptedCoords[i].right = encryptedCoords[modulo(i + 1, len)];
  encryptedCoords[i].left = encryptedCoords[modulo(i - 1, len)];

  encryptedCoordsPart2[i].right = encryptedCoordsPart2[modulo(i + 1, len)];
  encryptedCoordsPart2[i].left = encryptedCoordsPart2[modulo(i - 1, len)];
}

const parseNodes = (nodes, accumulator, current) => {
  for (const node of nodes) {
    if (node.value === 0) {
      accumulator = node;
      continue;
    }
    current = node;
    if (node.value > 0) {
      for (let i = 0; i < modulo(node.value, nodes.length - 1); i++) {
        current = current.right;
      }

      if (equals(node, current)) continue;

      node.right.left = node.left;
      node.left.right = node.right;

      current.right.left = node;
      node.right = current.right;

      current.right = node;
      node.left = current;
    } else {
      for (let i = 0; i < modulo(-node.value, nodes.length - 1); i++) {
        current = current.left;
      }

      if (equals(node, current)) continue;

      node.left.right = node.right;
      node.right.left = node.left;

      current.left.right = node;
      node.left = current.left;

      current.left = node;
      node.right = current;
    }
  }

  return { newAccumulator: accumulator, newCurrent: current };
};

const decrypt = (part2) => {
  let counter = 0;
  let accumulator = null;
  let current = null;

  if (!part2) {
    const { newAccumulator } = parseNodes(
      encryptedCoords,
      accumulator,
      current
    );
    accumulator = newAccumulator;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 1000; j++) accumulator = accumulator.right;
      counter += accumulator.value;
    }
  } else {
    for (let i = 0; i < 10; i++) {
      const { newAccumulator, newCurrent } = parseNodes(
        encryptedCoordsPart2,
        accumulator,
        current
      );
      accumulator = newAccumulator;
      current = newCurrent;
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 1000; j++) accumulator = accumulator.right;
      counter += accumulator.value;
    }
  }
  return counter;
};

const result = decrypt(false);

console.log(result); // part 1

const result2 = decrypt(true);

console.log(result2); // part 2
