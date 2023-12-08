import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';

import { range, intersection, memoizeWith } from 'ramda';

type Card = {
  cardNumber: number;
  need: number[];
  have: number[];
  matchCount: number;
}

type CardMemorized = {
  cards: Card[];
  cardNumber: number;
}

type SchrodingersCard = Card | undefined;

const getCardByNumber = memoizeWith((c: CardMemorized) => {
  return String(c.cardNumber);
}, ({ cards, cardNumber }: CardMemorized): SchrodingersCard => {
  return cards.find((card: Card) => {
    return card.cardNumber === cardNumber;
  });
});

const getResultCards = memoizeWith((c: CardMemorized) => {
  return String(c.cardNumber);
}, ({ cards, cardNumber }: CardMemorized): SchrodingersCard[] => {
  const foundCard = getCardByNumber({ cards, cardNumber });
  if (foundCard) {
    return range(foundCard.cardNumber + 1, foundCard.cardNumber + 1 + foundCard.matchCount).map((childCardNumber) => {
      return getCardByNumber({ cards, cardNumber: childCardNumber });
    });
  } else {
    return [];
  }
});

class Solution extends SolutionBase {

  public part1(): Result {
    const cards = this.parseCards();

    return cards.reduce((sum, card) => {
      const matchCount = intersection(card.have, card.need).length;
      let points = 0;

      if (matchCount > 1) {
        points = Math.pow(2, matchCount - 1);
      } else if (matchCount === 1) {
        points = 1;
      }

      return sum + points;
    }, 0);
  }

  public part2(): Result {
    const cards = this.parseCards();
    const cardInstances = cards.reduce<Record<string, number>>((acc, card) => {
      acc[card.cardNumber] = 1;
      return acc;
    }, {});

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const hits = card.matchCount;
      for (let j = 1; j <= hits && i + j < cards.length; j++) {
        const nextCard = cards[i + j];
        cardInstances[nextCard.cardNumber] =
          (cardInstances[nextCard.cardNumber] ?? 0) +
          cardInstances[card.cardNumber];
      }
    }

    return Object.values(cardInstances).reduce((sum, x) => sum + x, 0);
  }

  private parseCards(): Card[] {
    return this.input.filter(x => x).map(line => {
      const matches = line.match(/^Card +(\d+): (.*) +\| +(.*)$/);
      const have = (matches?.at(2) || '').split(/ +/).map((n) => parseInt(n, 10));
      const need = (matches?.at(3) || '').split(/ +/).map((n) => parseInt(n, 10));

      return {
        cardNumber: parseInt(matches?.at(1) || '', 10),
        have,
        need,
        matchCount: intersection(have, need).length,
      }
    });
  }
}

export default Solution;
