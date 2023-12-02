import { Command, Option } from 'clipanion';
import * as t from 'typanion';
import * as fs from 'fs/promises';
import * as path from 'path';
import kleur from 'kleur';

class SetupCommand extends Command {
  static paths = [[`setup`]];

  year = Option.String({ validator: t.isNumber() });
  day = Option.String({ validator: t.isNumber() });

  async execute() {
    const dirname = path.resolve(`./years/${this.year}/${String(this.day).padStart(2, '0')}`);

    console.log(kleur.blue(`Creating directory: ${dirname}`));
    await fs.mkdir(dirname, { recursive: true });

    const response = await fetch(`https://adventofcode.com/${this.year}/day/${this.day}/input`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `session=${process.env.AOC_COOKIE}`,
      },
    });

    const txt = await response.text();
    Bun.write(`${dirname}/input.txt`, txt + '\n');
    console.log(kleur.green(`Wrote file: input.txt`));

    Bun.write(`${dirname}/test_input_1.txt`, '');
    console.log(kleur.green(`Wrote file: test_input_1.txt`));

    Bun.write(`${dirname}/test_input_2.txt`, '');
    console.log(kleur.green(`Wrote file: test_input_2.txt`));

    fs.copyFile(`./lib/commands/templates/solution.ts.txt`, `${dirname}/solution.ts`);
    console.log(kleur.green(`Wrote file: solution.ts`));

    const tmpl = (await Bun.file(`./lib/commands/templates/solution.test.ts.txt`).text())
      .replaceAll('__YEAR__', this.year)
      .replaceAll('__DAY__', this.day);

    console.log(tmpl);
    console.log(`${dirname}/solution.test.ts`);

    Bun.write(`${dirname}/solution.test.ts`, tmpl);
    console.log(kleur.green(`Wrote file: solution.test.ts`));
  }
};

export default SetupCommand;
