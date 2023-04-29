const fs = require("fs");

const blueprints = fs
  .readFileSync("robots-blueprints.txt", "utf8")
  .split("\n")
  .filter(Boolean);

const blueprintProcessor = (() => {
  const blueprints = [];
  return {
    clean: () => {
      blueprints.length = 0;
    },
    stepper: (line) => {
      const splitLine = line
        .replace(/:/g, "")
        .split(" ")
        .map((val) => parseInt(val));

      blueprints.push({
        id: splitLine[1],
        ore: {
          ore: -splitLine[6],
          clay: 0,
          obsi: 0,
          crack: 0,
        },
        clay: {
          ore: -splitLine[12],
          clay: 0,
          obsi: 0,
          crack: 0,
        },
        obsi: {
          ore: -splitLine[18],
          clay: -splitLine[21],
          obsi: 0,
          crack: 0,
        },
        cracker: {
          ore: -splitLine[27],
          clay: 0,
          obsi: -splitLine[30],
          crack: 0,
        },
      });
    },
    result: (part2) => {
      function mergeStates(state1, state2) {
        state1.ore += state2.ore;
        state1.clay += state2.clay;
        state1.obsi += state2.obsi;
        state1.crack += state2.crack;
      }

      function greedy(blueprint) {
        const resources = {
          ore: 0,
          clay: 0,
          obsi: 0,
          crack: 0,
        };
        const bots = {
          ore: 1,
          clay: 0,
          obsi: 0,
          crack: 0,
        };
        for (let i = 0; i < 32; i++) {
          const toBuild = {
            ore: 0,
            clay: 0,
            obsi: 0,
            crack: 0,
          };
          if (
            -blueprint.cracker.ore <= resources.ore &&
            -blueprint.cracker.obsi <= resources.obsi
          ) {
            toBuild.crack += 1;
            mergeStates(resources, blueprint.cracker);
          } else if (
            -blueprint.obsi.ore <= resources.ore &&
            -blueprint.obsi.clay <= resources.clay
          ) {
            toBuild.obsi += 1;
            mergeStates(resources, blueprint.obsi);
          } else if (
            -blueprint.clay.ore <= resources.ore &&
            Math.random() > 0.5
          ) {
            toBuild.clay += 1;
            mergeStates(resources, blueprint.clay);
          } else if (
            -blueprint.ore.ore <= resources.ore &&
            Math.random() > 0.5
          ) {
            toBuild.ore += 1;
            mergeStates(resources, blueprint.ore);
          }
          mergeStates(resources, bots);
          mergeStates(bots, toBuild);
        }
        return resources.crack;
      }

      return part2
        ? blueprints
            .slice(0, 3)
            .map((blueprint) => {
              let current = 0;
              for (let i = 0; i < 1000000; i++) {
                const temp = greedy(blueprint);
                if (temp > current) {
                  current = temp;
                }
              }
              return current;
            })
            .reduce((acc, val) => acc * val, 1)
        : blueprints
            .map((blueprint) => {
              let current = 0;
              for (let i = 0; i < 100000; i++) {
                const temp = greedy(blueprint);
                if (temp > current) {
                  current = temp;
                }
              }
              return current * blueprint.id;
            })
            .reduce((acc, val) => acc + val, 0);
    },
  };
})();

blueprints.forEach(blueprintProcessor.stepper);

const result = blueprintProcessor.result(false);

console.log(result); // part 1

blueprintProcessor.clean();

blueprints.forEach(blueprintProcessor.stepper);

const result2 = blueprintProcessor.result(true);

console.log(result2); // part 2
