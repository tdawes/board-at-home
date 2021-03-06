import * as _ from "lodash";
import {
  Card,
  cardsPerNumber,
  Colour,
  GameType,
  getColours,
  getHandSize,
  numbers,
} from "../api";

const cardsForColor = (colour: Colour): Card[] =>
  _.flatten(
    numbers.map(numOnCard =>
      new Array(cardsPerNumber[numOnCard]).fill({ colour, num: numOnCard }),
    ),
  );

export const cannotCompleteEverySet = (
  discardPile: { [key in Colour]: Card[] },
) =>
  _.some(
    Object.values(discardPile).map(colour =>
      cannotCompleteSet(colour.map(card => card.num)),
    ),
  );

export const cannotCompleteSet = (discardedNumbers: number[]) =>
  _.some(
    numbers.map(
      numOnCard =>
        discardedNumbers.filter(num => num === numOnCard).length >=
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

export const createDeck = (gameType: GameType): Card[] =>
  shuffle(_.flatten(getColours(gameType).map(colour => cardsForColor(colour))));

export const deal = (deck: Card[], numPlayers: number): Card[][] => {
  const handSize = getHandSize(numPlayers);
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
