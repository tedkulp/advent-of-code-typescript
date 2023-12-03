import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';
import { range } from 'radash';

type Position = {
  x: number;
  y: number;
}

type PartNumber = {
  number: number;
  startPos: Position;
  endPos: Position;
  usable: false;
  adjacentGears: Symbol[];
}

type Symbol = {
  symbol: string;
  position: Position;
}

class Solution extends SolutionBase {

  public part1(): Result {
    const numbers = this.getPartNumbers();
    const symbols = this.getSymbols();

    const keepers = this.processParts(numbers, symbols).filter(x => x.usable);

    return keepers.reduce((acc, curr) => acc + curr.number, 0);
  }

  public part2(): Result {
    const numbers = this.getPartNumbers();
    const symbols = this.getSymbols();

    // Process all the parts and filter out any that don't have at least one adjacent gear
    const parts = this.processParts(numbers, symbols).filter(x => x.adjacentGears.length > 0);

    // Only get the gears from all the symbols
    const gears = symbols.filter(x => x.symbol === "*");

    // Get any part number matches for any gears. If they have less than two, filter them out right away
    const matches = gears.map(gear => {
      return parts.filter(part => part.adjacentGears.find(x => x.position.x === gear.position.x && x.position.y === gear.position.y));
    }).filter(x => x.length > 1);

    // Multiple the groups and sum the results
    return matches.reduce((acc, matchSet) => {
      return acc + matchSet.reduce((acc2, curr) => { return acc2 * curr.number }, 1);
    }, 0);
  }

  private processParts(numbers: PartNumber[], symbols: Symbol[]) {
    return numbers.map(number => {
      let matches: (Symbol | undefined)[] = [];

      // positions on same line
      matches = [...matches, this.getSymbolAtPosition(this.offsetPosition(number.startPos, -1, 0), symbols)];
      matches = [...matches, this.getSymbolAtPosition(this.offsetPosition(number.endPos, 1, 0), symbols)];

      for (const x of range(number.startPos.x - 1, number.endPos.x + 1)) {
        // positions above line
        matches = [...matches, this.getSymbolAtPosition({ x, y: number.startPos.y - 1 }, symbols)];

        // positions below line
        matches = [...matches, this.getSymbolAtPosition({ x, y: number.startPos.y + 1 }, symbols)];
      };

      return {
        number: number.number,
        startPos: number.startPos,
        endPos: number.endPos,
        usable: (matches.filter(x => x).length > 0),
        adjacentGears: matches.filter(x => x?.symbol === "*") as Symbol[],
      }
    });
  }

  private offsetPosition(position: Position, x: number, y: number) {
    return {
      x: position.x + x,
      y: position.y + y,
    };
  };

  private getSymbolAtPosition(position: Position, symbols: Symbol[]) {
    return symbols.find(symbol => {
      return symbol.position.x === position.x && symbol.position.y === position.y;
    });
  }

  private getPartNumbers() {
    return this.input.map((line, lineIdx) => {
      const rgx = /[0-9]+/g;
      let matches: PartNumber[] = [];
      let mtch;
      while ((mtch = rgx.exec(line)) != null) {
        const partNumber: PartNumber = {
          number: parseInt(mtch[0]),
          startPos: { x: mtch.index, y: lineIdx },
          endPos: { x: mtch.index + mtch[0].length - 1, y: lineIdx },
          usable: false,
          adjacentGears: [],
        };
        matches = [...matches, partNumber];
      }
      return matches;
    }).flat();
  }

  private getSymbols() {
    return this.input.map((line, lineIdx) => {
      const rgx = /[^0-9\.]+/g;
      let matches: Symbol[] = [];
      let mtch;
      while ((mtch = rgx.exec(line)) != null) {
        const symbol: Symbol = {
          symbol: mtch[0],
          position: { x: mtch.index, y: lineIdx },
        };
        matches = [...matches, symbol];
      }
      return matches;
    }).flat();
  }
}

export default Solution;
