import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';

import { head, tail } from 'ramda';
import * as ramda from 'ramda';

type SeedMap = {
  name: string | undefined;
  lines: MapLine[];
}

type MapLine = {
  destStart: number;
  sourceStart: number;
  range: number;
}

class Solution extends SolutionBase {

  public part1(): Result {
    const sources = ramda.splitWhenever(l => {
      return l.length === 0
    }, this.input)

    let seeds = this.getSeeds(sources);

    // Split the rest out into distinct maps
    const seedMaps = tail(sources).map<SeedMap>(map => {
      const lines = tail(map).map<MapLine>(line => {
        const [destStart, sourceStart, range] = line?.split(' ')?.map(Number);
        return { destStart, sourceStart, range };
      });
      return { name: head(map), lines };
    });

    // Loop through each map and update the seeds with any differences
    seedMaps.forEach(seedMap => {
      seeds = seeds.map(seed => {
        for (const line of seedMap.lines) {
          const diff = line.destStart - line.sourceStart;
          if (seed >= line.sourceStart && seed < (line.sourceStart + line.range)) {
            seed += diff;
            break;
          }
        }
        return seed;
      });
    });

    // Grab the lowest seed value
    return Math.min(...seeds);
  }

  public part2(): Result {
    return '';
  }

  private getSeeds(maps: string[][]): number[] {
    return head(head(maps) || [])?.
      match(/seeds: ([0-9 ]+)/)?.
      at(1)?.
      split(' ')?.
      map(Number) || [];
  }
}

export default Solution;
