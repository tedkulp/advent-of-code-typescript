import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';

import { list, zip } from 'radash';

class Solution extends SolutionBase {

  public part1(): Result {
    const races = zip(this.getNumbersFromLine(this.input[0]), this.getNumbersFromLine(this.input[1]));

    const results = races.map(([raceTime, recordDistance]) => {
      return list(1, raceTime - 1).map(n => {
        return this.calculateDistance(n, raceTime) > recordDistance;
      }).filter(x => !!x).length;
    });

    return results.reduce((a, b) => a * b, 1);
  }

  public part2(): Result {
    const [raceTime, recordDistance] = [this.getNumbersFromLineForNum2(this.input[0]), this.getNumbersFromLineForNum2(this.input[1])];

    const num = list(1, raceTime - 1).map(n => {
      return this.calculateDistance(n, raceTime) > recordDistance;
    }).filter(x => !!x).length;

    return num;
  }

  public calculateDistance(holdTime: number, totalTime: number): number {
    if (holdTime === 0 || holdTime === totalTime) {
      return 0;
    }

    const moveTime = totalTime - holdTime;
    const distance = moveTime * holdTime;

    return distance;
  }

  private getNumbersFromLine(line: string): number[] {
    return line.split(/ +/g).slice(1).map(Number);
  }

  private getNumbersFromLineForNum2(line: string): number {
    return Number(line.match(/[0-9]+/g).join(''));
  }

}

export default Solution;
