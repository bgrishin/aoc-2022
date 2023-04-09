const fs = require("fs");

const sections = fs
  .readFileSync("sections.txt", "utf8")
  .split("\n")
  .filter((x) => x);

const result = sections.filter((section) => {
  const [firstPair1, firstPair2, secondPair1, secondPair2] = section
    .split(",")
    .map((x) => x.split("-"))
    .flat();

  return (
    (+secondPair1 <= +firstPair1 && +secondPair2 >= +firstPair2) ||
    (+firstPair1 <= +secondPair1 && +firstPair2 >= +secondPair2)
  );
});

console.log(result.length); // part 1
