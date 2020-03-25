import { Color, Card } from "../api";
import * as _ from "lodash";

const cardsPerNumber: { [key: string]: number } = {
  1: 3,
  2: 2,
  3: 2,
  4: 2,
  5: 1,
};

const cardsForColor = (color: Color): Card[] =>
  _.flatten(
    Object.keys(cardsPerNumber).map(numOnCard =>
      new Array(cardsPerNumber[numOnCard]).fill({ color, num: numOnCard }),
    ),
  );

export const cannotCompleteEverySet = (
  discardPile: { [key in Color]: Card[] },
) =>
  _.some(
    Object.values(discardPile).map(color =>
      cannotCompleteSet(color.map(card => card.num)),
    ),
  );

const cannotCompleteSet = (discardedNumbers: number[]) =>
  _.some(
    Object.keys(cardsPerNumber).map(
      numOnCard =>
        discardedNumbers.filter(num => num === parseInt(numOnCard)).length >=
        cardsPerNumber[numOnCard],
    ),
  );

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const createDeck = (): Card[] => {
  const colors: Color[] = ["red", "blue", "green", "yellow", "white"];
  return shuffle(_.flatten(colors.map(color => cardsForColor(color))));
};

export const deal = (deck: Card[], numPlayers: number): Card[][] => {
  const handSize = numPlayers == 4 || numPlayers == 5 ? 4 : 5;
  const hands = [];
  for (let playerIdx = 0; playerIdx < numPlayers; playerIdx++) {
    const hand: Card[] = [];
    for (let numCards = 0; numCards < handSize; numCards++) {
      const card = deck.shift();
      if (!card) {
        throw new Error("Ran out of cards while dealing.");
      }
      hand.push(card);
    }
    hands.push(hand);
  }
  return hands;
};
