const fs = require("fs");

const signal = fs.readFileSync("signals.txt", "utf8");

for (let i = 0; i < signal.length; i++) {
  const pieceOfSignal = signal.slice(i, i + 14); // or 4
  const letters = pieceOfSignal.split("");
  const uniqueLetters = [...new Set(letters)];
  if (uniqueLetters.length === letters.length) {
    console.log(pieceOfSignal, i + 14); // part 1 and 2 (14 or 4)
    break;
  }
}
