import { Color, Card } from "../api";
import * as _ from "lodash";

const cardsForColor = (color: Color): Card[] => {
  return [
    { color, num: 5 },
    { color, num: 4 },
    { color, num: 4 },
    { color, num: 3 },
    { color, num: 3 },
    { color, num: 2 },
    { color, num: 2 },
    { color, num: 1 },
    { color, num: 1 },
    { color, num: 1 },
  ];
};

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
