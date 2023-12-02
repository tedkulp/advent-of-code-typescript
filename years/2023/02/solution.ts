import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';

type MoveData = {
  red?: number
  green?: number
  blue?: number
}

type Move = {
  index: number
  moves: MoveData[]
}

type MoveList = (Move | undefined)[];

class Solution extends SolutionBase {

  public part1(): Result {
    const parsed = this.getGameObjects();

    const gameList = parsed.map(game => {
      if (game) {
        const bad = game.moves.filter(move => {
          return (move?.red || 0) > 12 || (move?.green || 0) > 13 || (move?.blue || 0) > 14;
        });

        if (bad.length === 0) {
          return game.index;
        }
      }
    }).filter(x => x) as number[];

    return gameList.reduce((acc, cur) => { return acc + (cur || 0); }, 0);
  }

  public part2(): Result {
    const parsed = this.getGameObjects();

    const gameList = parsed.map(game => {
      let combinedMoveData: MoveData = {};

      if (game) {
        game.moves.forEach(moveData => {
          if (moveData.red) {
            if (!combinedMoveData.red || moveData.red > combinedMoveData.red) {
              combinedMoveData.red = moveData.red;
            }
          }

          if (moveData.green) {
            if (!combinedMoveData.green || moveData.green > combinedMoveData.green) {
              combinedMoveData.green = moveData.green;
            }
          }

          if (moveData.blue) {
            if (!combinedMoveData.blue || moveData.blue > combinedMoveData.blue) {
              combinedMoveData.blue = moveData.blue;
            }
          }
        });

        return (combinedMoveData.red || 1) * (combinedMoveData.green || 1) * (combinedMoveData.blue || 1);
      } else {
        return 0;
      }
    });

    return gameList.reduce((acc, cur) => { return acc + (cur || 0); }, 0);
  }

  private getGameObjects(): MoveList {
    const parsed = this.input.map(line => {
      const matches = line.match(/^Game (\d+): (.*)$/);
      if (matches) {
        const idx = parseInt(matches[1]);
        const moves = matches[2].split(';').map(move => move.trim());

        return {
          index: idx,
          moves: moves.map(move => {
            const move1 = move.split(',').map(m => {
              m = m.trim();
              const [num, color] = m.split(' ');
              return [color, parseInt(num)];
            });

            return move1.reduce((acc, cur) => {
              acc[cur[0]] = cur[1];
              return acc;
            }, {});
          }),
        };
      }
    }).filter(x => x);

    return parsed;
  }
}

export default Solution;
