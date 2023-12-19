import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';

import * as _ from 'lodash';

type Position = {
  pos: string;
  left: string;
  right: string;
};

type Pos = {
  l: string;
  r: string;
}

type PositionMap = Map<string, Pos>;

type Run = {
  currentPos: string;
  curInstruction: number;
  totalCount: number;
};

class Solution extends SolutionBase {

  public part1(): Result {
    const directions = this.input[0];

    const positions = this.input
      .slice(2)
      .filter(x => x)
      .map<Position>(line => {
        const matches = line.match(/([A-Z]{3}) \= \(([A-Z]{3}), ([A-Z]{3})\)/);
        return {
          pos: matches?.at(1),
          left: matches?.at(2),
          right: matches?.at(3),
        } as Position;
      });

    let finalCount = 0;
    let curDirIndex = 0;
    let curPos = 'AAA';

    while (curPos !== 'ZZZ') {
      const curDir = directions[curDirIndex];
      const nextPos = _.find(positions, pos => pos.pos === curPos);
      if (!nextPos) {
        break;
      }

      curPos = curDir === 'L' ? nextPos.left : nextPos.right;
      finalCount += 1;
      curDirIndex += 1;
      if (curDirIndex > directions.length - 1) {
        curDirIndex = 0;
      }
    }

    return finalCount;
  }

  public part2(): Result {
    const directions = this.input[0];

    const positions: PositionMap = new Map();
    this.input
      .slice(2)
      .filter(x => x)
      .forEach(line => {
        const matches = line.match(/([0-9A-Z]{3}) \= \(([0-9A-Z]{3}), ([0-9A-Z]{3})\)/) || [];
        if (!matches || matches.length < 3) {
          return;
        }

        positions.set(matches.at(1) || '', {
          l: matches.at(2) || '',
          r: matches.at(3) || '',
        });
      });

    const starting = Array.from(positions.keys()).filter(pos => pos[2] === 'A');

    const runs = starting.map<Run>(pos => {
      return {
        currentPos: pos,
        curInstruction: 0,
        totalCount: 0,
      };
    });

    runs.forEach(run => {
      while (run.currentPos[2] !== 'Z') {
        const curPos = positions.get(run.currentPos);
        const curDir = directions[run.totalCount % directions.length];
        const newPos = curDir === 'L' ? curPos?.l : curPos?.r;

        run.currentPos = newPos || '';
        run.totalCount += 1;
      }
    });

    return this.lcm(runs.map(run => run.totalCount));
  }

  private lcm(arr: number[]): number {
    return arr.reduce((acc, n) => (acc * n) / this.gcd(acc, n));
  }

  private gcd(a: number, b: number): number {
    return b === 0 ? a : this.gcd(b, a % b);
  }
}

export default Solution;
