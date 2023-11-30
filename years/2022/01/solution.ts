import * as R from 'ramda';

import { SolutionBase } from '../../../lib/solution';
import { Input, Result } from '../../../lib/types';

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const toI = (i: any) => parseInt(i);
const caloriesPerElf = (input: Input) => R.splitWhenever(R.equals(NaN), input.map(toI)).map(R.sum);
const findMax = (array: number[]): number => R.apply(Math.max, array);
const sortNums = (array: number[], direction: SortDirection = SortDirection.ASC): number[] =>
  array.sort(numberCompare(direction));
const numberCompare =
  (direction: SortDirection = SortDirection.ASC) =>
    (a: number, b: number) =>
      direction === SortDirection.ASC ? Math.sign(a - b) : Math.sign(b - a);

class Day01 extends SolutionBase {

  public part1(): Result {
    return (findMax(caloriesPerElf(this.input)) || '');
  }

  public part2(): Result {
    return R.sum(sortNums(caloriesPerElf(this.input), SortDirection.DESC).slice(0, 3));
  }

}

export default Day01;
