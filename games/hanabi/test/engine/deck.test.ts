import {
  createDeck,
  cannotCompleteSet,
  cannotCompleteEverySet,
  deal,
} from "../../src/engine/deck";
import {
  cardsPerNumber,
  colours,
  emptyDiscardPile,
  getHandSize,
} from "../../src/api";
import * as _ from "lodash";

describe("createDeck", () => {
  it("Creates a full deck", () => {
    const deck = createDeck();
    const expectedDeckSize =
      _.sum(Object.values(cardsPerNumber)) * colours.length;
    expect(deck.length).toBe(expectedDeckSize);
  });
});

describe("cannotCompleteSet", () => {
  it("Returns false if nothing has been discarded", () => {
    expect(cannotCompleteSet([])).toBeFalsy();
  });
  it("Returns true if all cards of a color have been discarded", () => {
    expect(cannotCompleteSet([5])).toBeTruthy();
    expect(cannotCompleteSet([2, 2])).toBeTruthy();
    expect(cannotCompleteSet([1, 3, 3, 2])).toBeTruthy();
    expect(cannotCompleteSet([4, 2, 4])).toBeTruthy();
    expect(cannotCompleteSet([1, 2, 3, 4, 1, 1])).toBeTruthy();
  });
});

describe("cannotCompleteEverySet", () => {
  it("Returns false if all sets can still be completed", () => {
    expect(cannotCompleteEverySet(emptyDiscardPile)).toBeFalsy;
  });
  it("Returns true if a set can not be completed anymore", () => {
    const pile = emptyDiscardPile;
    pile["red"] = [{ color: "red", num: 5 }];
    expect(cannotCompleteEverySet(pile)).toBeTruthy;
  });
});

describe("deal", () => {
  it("Deals out cards to players from the deck", () => {
    const numPlayers = 2;
    const deck = createDeck();
    const startingDeckSize = deck.length;
    const handSize = getHandSize(numPlayers);
    const hands = deal(deck, numPlayers);
    expect(hands.length).toBe(numPlayers);
    expect(hands[0].length).toBe(handSize);
    expect(hands[1].length).toBe(handSize);
    expect(deck.length).toBe(startingDeckSize - numPlayers * handSize);
  });
});
