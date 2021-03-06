import * as _ from "lodash";
import {
  cardsPerNumber,
  getColours,
  getEmptyDiscardPile,
  getHandSize,
} from "../../src/api";
import {
  cannotCompleteEverySet,
  cannotCompleteSet,
  createDeck,
  deal,
} from "../../src/engine/deck";

describe("createDeck", () => {
  it("Creates a full basic deck", () => {
    const gameType = "basic";
    const deck = createDeck(gameType);
    const expectedDeckSize =
      _.sum(Object.values(cardsPerNumber)) * getColours(gameType).length;
    expect(deck.length).toEqual(expectedDeckSize);
  });
  it("Creates a full deck with rainbow if specified", () => {
    const gameType = "rainbow";
    const deck = createDeck(gameType);
    const expectedDeckSize =
      _.sum(Object.values(cardsPerNumber)) * getColours(gameType).length;
    expect(deck.length).toEqual(expectedDeckSize);
  });
});

describe("cannotCompleteSet", () => {
  it("Returns false if nothing has been discarded", () => {
    expect(cannotCompleteSet([])).toBeFalsy();
  });
  it("Returns true if all cards of a colour have been discarded", () => {
    expect(cannotCompleteSet([5])).toBeTruthy();
    expect(cannotCompleteSet([2, 2])).toBeTruthy();
    expect(cannotCompleteSet([1, 3, 3, 2])).toBeTruthy();
    expect(cannotCompleteSet([4, 2, 4])).toBeTruthy();
    expect(cannotCompleteSet([1, 2, 3, 4, 1, 1])).toBeTruthy();
  });
});

describe("cannotCompleteEverySet", () => {
  const pile = getEmptyDiscardPile("basic");
  it("Returns false if all sets can still be completed", () => {
    expect(cannotCompleteEverySet(pile)).toBeFalsy;
  });
  it("Returns true if a set can not be completed anymore", () => {
    pile.red = [{ colour: "red", num: 5 }];
    expect(cannotCompleteEverySet(pile)).toBeTruthy;
  });
});

describe("deal", () => {
  it("Deals out cards to players from the deck", () => {
    const numPlayers = 2;
    const deck = createDeck("basic");
    const startingDeckSize = deck.length;
    const handSize = getHandSize(numPlayers);
    const hands = deal(deck, numPlayers);
    expect(hands).toHaveLength(numPlayers);
    expect(hands[0]).toHaveLength(handSize);
    expect(hands[1]).toHaveLength(handSize);
    expect(deck).toHaveLength(startingDeckSize - numPlayers * handSize);
  });
});
