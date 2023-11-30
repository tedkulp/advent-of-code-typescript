import { Command, Option } from 'clipanion';
import * as t from 'typanion';
import { ModuleImport } from '../types';

class TestCommand extends Command {
  static paths = [[`test`]];

  year = Option.String({ validator: t.isNumber() });
  month = Option.String({ validator: t.isNumber() });

  async execute() {
    const moduleImport: ModuleImport = await import(`../../years/${this.year}/${String(this.month).padStart(2, '0')}/solution.ts`);
    const input = Bun.file(`./years/${this.year}/${String(this.month).padStart(2, '0')}/test_input.txt`);
    const txt = await input.text()

    const solution = new moduleImport.default(txt.split('\n'));
    console.log(`Part 1: ${solution.part1()}`);
    console.log(`Part 2: ${solution.part2()}`);
  }
};

export default TestCommand;
