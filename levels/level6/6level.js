const fs = require("fs");

const signal = fs.readFileSync("signals.txt", "utf8");

for (let i = 0; i < signal.length; i++) {
  const peaceOfSignal = signal.slice(i, i + 14);
  const letters = peaceOfSignal.split("");
  const uniqueLetters = [...new Set(letters)];
  if (uniqueLetters.length === letters.length) {
    console.log(peaceOfSignal, i + 14);
    break;
  }
}
