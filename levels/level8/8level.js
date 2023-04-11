const fs = require("fs");

const trees = fs
  .readFileSync("trees.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const getTree = (x, y) => {
  const tree = trees[y][x % trees[y].length];
  return tree;
};

const getTreesAround = (x, y) => {
  let upperTrees = [];
  let downTrees = [];
  let leftTrees = [];
  let rightTrees = [];

  for (let i = 0; i < y; i++) {
    const tree = getTree(x, y - i - 1);
    upperTrees.push(+tree);
  }

  for (let i = 1; i < trees.length - y; i++) {
    const tree = getTree(x, y + i);
    downTrees.push(+tree);
  }

  for (let i = 0; i < x; i++) {
    const tree = getTree(x - i - 1, y);
    leftTrees.push(+tree);
  }

  for (let i = 1; i < 99 - x; i++) {
    const tree = getTree(x + i, y);
    rightTrees.push(+tree);
  }

  return [upperTrees, downTrees, leftTrees.reverse(), rightTrees];
};

const result = trees
  .flatMap((treeNet, y) => {
    return treeNet.split("").map((tree, x) => {
      const [upperTrees, downTrees, leftTrees, rightTrees] = getTreesAround(
        x,
        y
      );
      return !!(
        upperTrees.every((x) => x < +tree) ||
        downTrees.every((x) => x < +tree) ||
        leftTrees.every((x) => x < +tree) ||
        rightTrees.every((x) => x < +tree)
      );
    });
  })
  .filter((x) => x).length;

console.log(result); // part 1
