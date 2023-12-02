import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';
import { sum } from 'radash';

type NumberMap = { [key: string]: string };

const replacements: NumberMap = {
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9",
};

const revReplacements: NumberMap = {
  "eno": "1",
  "owt": "2",
  "eerht": "3",
  "ruof": "4",
  "evif": "5",
  "xis": "6",
  "neves": "7",
  "thgie": "8",
  "enin": "9",
};

class Solution extends SolutionBase {
  public part1(): Result {
    return sum(this.input
      .filter(x => x)
      .map(line => {
        const nums = line.replace(/\D+/g, '');
        const tens = nums[0];
        const ones = nums[nums.length - 1];

        return parseInt(tens) * 10 + parseInt(ones);
      }));
  }

  public part2(): Result {
    return sum(this.input
      .filter(x => x)
      .map(line => {
        const tens = this.numReplace(line, replacements).replace(/\D+/g, '')[0];
        const ones = this.numReplace(this.reverse(line), revReplacements).replace(/\D+/g, '')[0];

        return parseInt(tens) * 10 + parseInt(ones);
      }));
  }

  private reverse(s: string) {
    return s.split("").reverse().join("");
  }

  private numReplace(str: string, numberMap: NumberMap): string {
    let done = false;
    let counter = 0;

    do {
      const piece = str.slice(counter);

      Object.keys(numberMap).forEach(key => {
        if (piece.startsWith(key)) {
          str = str.replace(key, numberMap[key]);
          return;
        }
      });

      if (counter > str.length) {
        done = true;
      } else {
        counter++;
      }
    } while (!done);

    return str;
  }
}

export default Solution;
