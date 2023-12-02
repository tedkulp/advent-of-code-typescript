import { Command, Option } from 'clipanion';
import * as t from 'typanion';
import { ModuleImport } from '../types';
import { spawnSync } from 'child_process';

class RunCommand extends Command {
  static paths = [[`run`]];

  year = Option.String({ validator: t.isNumber() });
  day = Option.String({ validator: t.isNumber() });
  test = Option.Boolean(`--test`, false, { description: `Should we compare to the test outputs?` })

  async execute() {
    const pathBits = `years/${this.year}/${String(this.day).padStart(2, '0')}`;
    const moduleImport: ModuleImport = await import(`../../${pathBits}/solution.ts`);
    const input = Bun.file(`./${pathBits}/input.txt`);

    const txt = await input.text()
    const solution = new moduleImport.default(txt);

    if (this.test) {
      spawnSync(
        "bun",
        [
          "test",
          `${pathBits}/*`,
        ],
        { stdio: "inherit", shell: true },
      );

    } else {
      console.log(`Part 1: ${solution.part1()}`);
      console.log(`Part 2: ${solution.part2()}`);
    }

    // if (this.test) {
    //   const part1sol = solution.part1();
    //   const part1test = solution.test_output1();
    //   console.log(`Part 1 implement returned: ${part1sol}`);
    //   console.log(`Part 1 test output: ${part1test}`);
    //
    //   const txt2 = await Bun.file(`./years/${this.year}/${String(this.day).padStart(2, '0')}/test_input_2.txt`).text();
    //   const solution2 = new moduleImport.default(txt2);
    //   const part2sol = solution2.part2();
    //   const part2test = solution2.test_output2();
    //   console.log(`Part 2 implement returned: ${part2sol}`);
    //   console.log(`Part 2 test output: ${part2test}`);
    // } else {
    // }
  }
};

export default RunCommand;
