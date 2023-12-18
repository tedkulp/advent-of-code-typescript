import { SolutionBase } from '../../../lib/solution';
import { Result } from '../../../lib/types';

import { counting } from 'radash';

const convertObjToTuple = (obj: Record<string, number>, reverse = true) => {
  return Object.keys(obj).map(function(key) {
    return reverse ? [obj[key], key] : [key, obj[key]];
  });
};

let cardValues: Record<string, number> = {
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  'T': 9,
  'J': 10,
  'Q': 11,
  'K': 12,
  'A': 13,
};

let cardValueLookup = convertObjToTuple(cardValues);

const handValues: Record<string, number> = {
  'HighCard': 1,
  '1pair': 2,
  '2pair': 3,
  '3ofakind': 4,
  'FullHouse': 5,
  '4ofakind': 6,
  '5ofakind': 7,
};

// const handValueLookup = convertObjToTuple(handValues, false);

const compareCards = (a: string, b: string) => {
  return (cardValues[a] > cardValues[b]) - (cardValues[a] < cardValues[b]);
};

const compareHands = (a: string, b: string) => {
  for (let i = 0; i < a.length; i++) {
    const val = compareCards(a[i], b[i]);
    if (val !== 0) {
      return Number(val);
    }
  }
  return 0;

};

class Solution extends SolutionBase {

  public part1(): Result {
    let hands = this.input.filter(x => x).map(line => {
      const matches = line.match(/^(\w+) ([0-9]+)$/);
      return {
        cards: matches?.[1],
        score: this.calculateScore(matches?.[1] || ''),
        bid: Number(matches?.[2]),
        handType: this.handType(matches?.[1] || ''),
        handTypeValue: handValues[this.handType(matches?.[1] || '')],
      }
    });

    hands = hands.sort((a, b) => {
      return ((a.handTypeValue < b.handTypeValue) - (a.handTypeValue > b.handTypeValue)) || -compareHands(a.cards, b.cards);
    }).reverse();

    return hands.reduce((acc, hand, idx) => {
      return acc + hand.bid * (idx + 1);
    }, 0);
  }

  public part2(): Result {
    cardValues = {
      'J': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      'T': 10,
      'Q': 11,
      'K': 12,
      'A': 13,
    };

    cardValueLookup = convertObjToTuple(cardValues);

    let hands = this.input.filter(x => x).map(line => {
      const matches = line.match(/^(\w+) ([0-9]+)$/);
      return {
        cards: matches?.[1],
        score: this.calculateScore(matches?.[1] || ''),
        bid: Number(matches?.[2]),
        handType: this.handType(matches?.[1] || ''),
        handTypeValue: handValues[this.handType(matches?.[1] || '')],
      }
    });

    console.log(hands);
  }

  public calculateScore(hand: string) {
    return hand.split('').map(card => cardValues[card] || 0).reduce((a, b) => a + b, 0);
  }

  public sortHands(hands: string[]) {
    return hands.sort((a, b) => this.calculateScore(b) - this.calculateScore(a));
  }

  public sortHandsByCard(hands: string[]) {
    const _hands = hands;
    _hands.sort((a, b) => compareHands(a, b));
    _hands.reverse();
    return _hands;
  }

  public compareCards(a: string, b: string) {
    return compareCards(a, b);
  }

  public compareHands(a: string, b: string) {
    return compareHands(a, b);
  }

  public handType(hand: string) {
    const counts = convertObjToTuple(counting(hand.split(''), g => g));
    const justCounts = counts.map(x => x[0]);
    if (justCounts.includes(5)) {
      return '5ofakind';
    }
    if (justCounts.includes(4)) {
      return '4ofakind';
    }
    if (justCounts.includes(3) && justCounts.includes(2)) {
      return 'FullHouse';
    }
    if (justCounts.includes(3)) {
      return '3ofakind';
    }
    if (justCounts.filter(x => x === 2).length === 2) {
      return '2pair';
    }
    if (justCounts.filter(x => x === 2).length === 1) {
      return '1pair';
    }

    return 'HighCard';
  }

}

export default Solution;
