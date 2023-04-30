const fs = require("fs");
const nerdamer = require("nerdamer");

require("nerdamer/Solve");

let monkeys = [];
let monkeys2 = [];

fs.readFileSync("monkey-numbers.txt", "utf8")
  .split("\n")
  .filter(Boolean)
  .forEach((monkeyLine) => {
    let [name, equation] = monkeyLine.split(": ");
    let number, monkey1, monkey2, action;

    if (isNaN(equation)) {
      [monkey1, action, monkey2] = equation.split(" ");
    } else {
      number = +equation;
    }

    monkeys[name] = { name, number, monkey1, action, monkey2 };
    monkeys2[name] = { name, number, monkey1, action, monkey2 };
  });

const getMonkeyValue = (monkeyName) => {
  let monkey = monkeys[monkeyName];
  if (!isNaN(monkey.number)) return monkey.number;

  monkey.monkey1 = getMonkeyValue(monkey.monkey1);
  monkey.monkey2 = getMonkeyValue(monkey.monkey2);

  switch (monkey.action) {
    case "+":
      monkey.number = monkey.monkey1 + monkey.monkey2;
      break;
    case "-":
      monkey.number = monkey.monkey1 - monkey.monkey2;
      break;
    case "*":
      monkey.number = monkey.monkey1 * monkey.monkey2;
      break;
    case "/":
      monkey.number = monkey.monkey1 / monkey.monkey2;
      break;
  }

  return monkey.number;
};

const monkeyEquation = (monkeyName) => {
  let monkey = monkeys2[monkeyName];
  if (!isNaN(monkey.number)) return monkey.number;
  if (monkey.number === "y") return monkey.number;
  monkey.monkey1 = monkeyEquation(monkey.monkey1);
  monkey.monkey2 = monkeyEquation(monkey.monkey2);
  return (
    "(" + monkey.monkey1 + ")" + monkey.action + "(" + monkey.monkey2 + ")"
  );
};

const result = getMonkeyValue("root");

console.log(result); // part 1

monkeys2["root"].action = "=";
monkeys2["humn"].number = "y";

const result2 = +nerdamer
  .solve(monkeyEquation("root"), "y")
  .text()
  .match(/\d+/g)[0]; // i decided to build equation in text and then solve it by using nerdamer

console.log(result2); // part 2
