const fs = require("fs");

const fileSystemBuild = {
  currentDirectory: "",
};

const fileSystem = fs
  .readFileSync("file-system.txt", "utf8")
  .split("\n")
  .filter((x) => x);

fileSystem.map((line) => {
  if (line.startsWith("$")) {
    const [command, param] = line.split(" ").slice(1, 3);
    if (command === "cd") {
      if (param === "/") {
        fileSystemBuild.currentDirectory = "";
        fileSystemBuild[fileSystemBuild.currentDirectory] = [];
        return;
      }
      if (param === "..") {
        fileSystemBuild.currentDirectory = fileSystemBuild.currentDirectory
          .split("/")
          .slice(0, -1)
          .join("/");
        return;
      }
      fileSystemBuild.currentDirectory = `${fileSystemBuild.currentDirectory}/${param}`;
      fileSystemBuild[fileSystemBuild.currentDirectory] = [];
    }
    return;
  }

  if (line.startsWith("dir")) {
    const [dirName] = line.split(" ").slice(1, 2);

    fileSystemBuild[fileSystemBuild.currentDirectory].push({
      dir: dirName,
    });
    return;
  }

  const [fileSize, fileName] = line.split(" ");
  fileSystemBuild[fileSystemBuild.currentDirectory].push({
    fileName,
    fileSize: +fileSize,
  });
});

const inspectTreeSize = (tree, path) => {
  let totalSize = 0;
  tree.map((item) => {
    if (item.dir) {
      totalSize += inspectTreeSize(
        fileSystemBuild[path + "/" + item.dir],
        path + "/" + item.dir
      );
      return;
    }
    totalSize += item.fileSize;
  });
  return totalSize;
};

const result = Object.keys(fileSystemBuild)
  .slice(1)
  .filter((key) => {
    const files = fileSystemBuild[key];
    const totalSize = inspectTreeSize(files, key);
    return totalSize < 100000;
  })
  .map((key) => {
    const files = fileSystemBuild[key];
    return inspectTreeSize(files, key);
  })
  .reduce((partialSum, a) => partialSum + a, 0);

console.log(result); // part 1

function countUsedSpace(obj) {
  let usedSpace = 0;
  for (const path in obj) {
    const node = obj[path];
    if (Array.isArray(node)) {
      for (const file of node) {
        if (file.fileSize) {
          usedSpace += file.fileSize;
        }
      }
    } else if (typeof node === "object" && node !== null) {
      usedSpace += countUsedSpace(node);
    }
  }
  return usedSpace;
}

const totalDiskspace = 70_000_000;
const unusedSpace = 30_000_000;
const usedSpace = countUsedSpace(fileSystemBuild);

const minRequired = unusedSpace - (totalDiskspace - usedSpace);
let result2 = Infinity;

Object.keys(fileSystemBuild)
  .slice(1)
  .filter((key) => {
    const files = fileSystemBuild[key];
    const totalSize = inspectTreeSize(files, key);
    if (totalSize >= minRequired && totalSize < result2) {
      result2 = totalSize;
    }
  });

console.log(result2); // part 2
