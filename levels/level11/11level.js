const fs = require("fs");

let monkeys = fs
  .readFileSync("monkeys.txt", "utf8")
  .split("\n\n")
  .filter((x) => x);

const parseMonkey = (monkey) => {
  const [
    monkeyLine,
    itemsLine,
    operationLine,
    testDivisibleLine,
    testTrueLine,
    testFalseLine,
  ] = monkey.split("\n");

  const id = +monkeyLine.match(/(\d+)/)[0];
  const items = itemsLine.match(/(\d+)/g).map(Number);
  const operation = operationLine.trim().split(" ").slice(3, 6).join(" ");
  const divisibleBy = +testDivisibleLine.match(/(\d+)/)[0];
  const testTrue = +testTrueLine.match(/(\d+)/)[0];
  const testFalse = +testFalseLine.match(/(\d+)/)[0];

  return {
    id,
    items,
    operation,
    divisibleBy,
    testTrue,
    testFalse,
    inspectedAmount: 0,
  };
};

let monkeyGame = monkeys.map((monkey) => parseMonkey(monkey));

const commonMultiple = monkeyGame.reduce(
  (total, monkey) => total * monkey.divisibleBy,
  1
);

const runGame = (rounds, part2) => {
  for (let i = 0; i < rounds; i++) {
    monkeyGame.forEach((monkey, i) => {
      monkey.items.forEach((item) => {
        const old = item;

        const newValue = part2
          ? eval(monkey.operation)
          : Math.floor(eval(monkey.operation) / 3);

        const reducedNewValue = newValue % commonMultiple;

        if (newValue % monkey.divisibleBy === 0) {
          monkeyGame[monkey.testTrue].items.push(
            part2 ? reducedNewValue : newValue
          );
        } else {
          monkeyGame[monkey.testFalse].items.push(
            part2 ? reducedNewValue : newValue
          );
        }
        monkeyGame[i].inspectedAmount += 1;
      });
      monkeyGame[i].items = [];
    });
  }
};

runGame(20, false);

const [firstValue, secondValue] = monkeyGame
  .sort((a, b) => b.inspectedAmount - a.inspectedAmount)
  .slice(0, 2)
  .map((x) => x.inspectedAmount);

const result = firstValue * secondValue;

console.log(result); // part 1

monkeyGame = monkeys.map((monkey) => parseMonkey(monkey));
runGame(10000, true);

const [firstValue2, secondValue2] = monkeyGame
  .sort((a, b) => b.inspectedAmount - a.inspectedAmount)
  .slice(0, 2)
  .map((x) => x.inspectedAmount);

const result2 = firstValue2 * secondValue2;

console.log(result2); // part 2
