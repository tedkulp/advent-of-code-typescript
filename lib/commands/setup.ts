import { Command, Option } from 'clipanion';
import * as t from 'typanion';
import * as fs from 'fs/promises';
import * as path from 'path';
import kleur from 'kleur';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

class SetupCommand extends Command {
  static paths = [[`setup`]];

  year = Option.String({ validator: t.isNumber() });
  day = Option.String({ validator: t.isNumber() });

  async getInput() {
    const response = await fetch(`https://adventofcode.com/${this.year}/day/${this.day}/input`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `session=${process.env.AOC_COOKIE}`,
      },
    });

    return await response.text();
  }

  async getDescription() {
    const response = await fetch(`https://adventofcode.com/${this.year}/day/${this.day}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Cookie: `session=${process.env.AOC_COOKIE}`,
      },
    });

    return await response.text();
  }

  async execute() {
    const turndownService = new TurndownService({ headingStyle: 'atx' });

    const dirname = path.resolve(`./years/${this.year}/${String(this.day).padStart(2, '0')}`);

    console.log(kleur.blue(`Creating directory: ${dirname}`));
    await fs.mkdir(dirname, { recursive: true });

    const desc = await this.getDescription();
    const $ = cheerio.load(desc);

    $('.day-desc').each((i, el) => {
      const md = turndownService.turndown($(el).html());
      Bun.write(`${dirname}/part${i + 1}.md`, md + '\n');
      console.log(kleur.green(`Wrote file: part${i + 1}.md`));

      const sampleData = $(el).find('pre').first().text();
      Bun.write(`${dirname}/test_input_${i + 1}.txt`, sampleData + '\n');
      console.log(kleur.green(`Wrote file: test_input_${i + 1}.md`));
    });

    const txt = await this.getInput();
    Bun.write(`${dirname}/input.txt`, txt + '\n');
    console.log(kleur.green(`Wrote file: input.txt`));

    if (await fs.exists(`${dirname}/solution.ts`)) {
      console.log(kleur.yellow(`File already exists: solution.ts`));
    } else {
      fs.copyFile(`./lib/commands/templates/solution.ts.txt`, `${dirname}/solution.ts`);
      console.log(kleur.green(`Wrote file: solution.ts`));
    }

    if (await fs.exists(`${dirname}/solution.test.ts`)) {
      console.log(kleur.yellow(`File already exists: solution.test.ts`));
    } else {
      const tmpl = (await Bun.file(`./lib/commands/templates/solution.test.ts.txt`).text())
        .replaceAll('__YEAR__', this.year)
        .replaceAll('__DAY__', this.day);

      Bun.write(`${dirname}/solution.test.ts`, tmpl);
      console.log(kleur.green(`Wrote file: solution.test.ts`));
    }
  }
};

export default SetupCommand;
