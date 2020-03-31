import {
  drawCard,
  moveCard,
  selectCard,
  deselectCard,
  toggleCardSelection,
  playCard,
  discardCard,
  addInfoToken,
  removeInfoToken,
  advancePlayer,
} from "../../src/engine/actions";
import { getInitialBoard } from "../../src/engine/board";
import { defaultConfig } from "../../src/client";
import { Board, State, Card, noSelectedCards, maxCardNum } from "../../src/api";

const board: Board = getInitialBoard(2, defaultConfig);
const startState: State = {
  board,
  finished: false,
  currentPlayer: 0,
  selectedCards: noSelectedCards,
};
const getStartStateCopy = (): State => JSON.parse(JSON.stringify(startState));

describe("addInfoToken", () => {
  it("Increases the number of info tokens by one when not full", () => {
    const testState = {
      ...startState,
      board: { infoTokens: defaultConfig.infoTokens - 1, ...startState.board },
    };
    addInfoToken(testState, defaultConfig.infoTokens);
    expect(testState.board.infoTokens).toEqual(defaultConfig.infoTokens);
  });
  it("Does not increase when info tokens are full", () => {
    const testState = { ...startState };
    addInfoToken(testState, defaultConfig.infoTokens);
    expect(testState.board.infoTokens).toEqual(defaultConfig.infoTokens);
  });
});

describe("removeInfoToken", () => {
  it("Decreases the number of info tokens by one when not empty", () => {
    const testState = { ...startState };
    removeInfoToken(testState);
    expect(testState.board.infoTokens).toEqual(defaultConfig.infoTokens - 1);
  });
  it("Does not decrease when info tokens are empty", () => {
    const testState = {
      ...startState,
      board: { ...startState.board, infoTokens: 0 },
    };
    expect(() => removeInfoToken(testState)).toThrow();
  });
});

describe("drawCard", () => {
  it("Removes card from deck and adds it to current player's hand", () => {
    const testState = { ...startState };
    const prevDeckSize = testState.board.deck.length;
    const prevHandSize = testState.board.hands[testState.currentPlayer].length;
    const topCard = testState.board.deck[0];
    drawCard(testState);
    expect(testState.board.deck).toHaveLength(prevDeckSize - 1);
    const newHandSize = testState.board.hands[testState.currentPlayer].length;
    expect(newHandSize).toEqual(prevHandSize + 1);
    expect(
      testState.board.hands[testState.currentPlayer][newHandSize - 1],
    ).toEqual(topCard);
  });
  it("Adds nothing when drawing from empty deck", () => {
    const testState = {
      ...startState,
      board: { ...startState.board, deck: [] },
    };
    const prevHandSize = testState.board.hands[testState.currentPlayer].length;
    drawCard(testState);
    expect(testState.board.deck.length).toEqual(0);
    const newHandSize = testState.board.hands[testState.currentPlayer].length;
    expect(newHandSize).toEqual(prevHandSize);
    expect(
      testState.board.hands[testState.currentPlayer][newHandSize - 1],
    ).toEqual(
      startState.board.hands[startState.currentPlayer][prevHandSize - 1],
    );
  });
});

describe("selectCard", () => {
  it("Marks only this card as selected", () => {
    const testState = {
      ...startState,
      selectedCards: [[], [], [3], [], []],
    };
    selectCard(testState, 0, 0);
    expect(testState.selectedCards[0]).toContain(0);
    expect(testState.selectedCards[1]).toEqual([]);
    selectCard(testState, 1, 1);
    expect(testState.selectedCards[0]).toContain(0);
    expect(testState.selectedCards[1]).toContain(1);
    expect(testState.selectedCards[2]).toEqual([3]);
    expect(testState.selectedCards[3]).toEqual([]);
  });
});

describe("deselectCard", () => {
  it("Marks only this card as not selected", () => {
    const testState = {
      ...startState,
      selectedCards: [[0], [0, 1, 2], [0], [], []],
    };
    deselectCard(testState, 0, 0);
    expect(testState.selectedCards[0]).toEqual([]);
    deselectCard(testState, 1, 1);
    expect(testState.selectedCards[0]).toEqual([]);
    expect(testState.selectedCards[1]).toEqual([0, 2]);
    expect(testState.selectedCards[2]).toEqual([0]);
    expect(testState.selectedCards[3]).toEqual([]);
  });
});

describe("toggleCardSelection", () => {
  it("Marks card as selected if not yet", () => {
    const testState = { ...startState };
    toggleCardSelection(testState, 0, 0);
    expect(testState.selectedCards[0]).toContain(0);
  });
  it("Marks card as not selected if it currently is", () => {
    const testState = {
      ...startState,
      selectedCards: [[0], [0, 1, 2], [], [], []],
    };
    toggleCardSelection(testState, 0, 0);
    expect(testState.selectedCards[0]).toEqual([]);
  });
});

describe("moveCard", () => {
  const testState = getStartStateCopy();
  const move = { hand: 1, card: 1 };
  it("Moves card to the left", () => {
    const card = { ...testState.board.hands[move.hand][move.card] };
    const leftCard = { ...testState.board.hands[move.hand][move.card - 1] };
    const rightCard = { ...testState.board.hands[move.hand][move.card + 1] };
    moveCard(testState, move.hand, move.card, "left");
    expect(testState.board.hands[move.hand][move.card - 1]).toEqual(card);
    expect(testState.board.hands[move.hand][move.card]).toEqual(leftCard);
    expect(testState.board.hands[move.hand][move.card + 1]).toEqual(rightCard);
  });
  it("Moves card to the right", () => {
    const card = testState.board.hands[move.hand][move.card];
    const leftCard = testState.board.hands[move.hand][move.card - 1];
    const rightCard = testState.board.hands[move.hand][move.card + 1];
    moveCard(testState, move.hand, move.card, "right");
    expect(testState.board.hands[move.hand][move.card + 1]).toEqual(card);
    expect(testState.board.hands[move.hand][move.card]).toEqual(rightCard);
    expect(testState.board.hands[move.hand][move.card - 1]).toEqual(leftCard);
  });
  it("Doesn't allow moving leftmost card further left", () => {
    expect(() => moveCard(testState, move.hand, 0, "left")).toThrow();
  });
  it("Doesn't allow moving rightmost card further right", () => {
    const rightmost = testState.board.hands[move.hand].length - 1;
    expect(() => moveCard(testState, move.hand, rightmost, "right")).toThrow();
  });
  it("Moves selection too", () => {
    selectCard(testState, move.hand, move.card);
    expect(testState.selectedCards[move.hand]).toEqual([move.card]);
    moveCard(testState, move.hand, move.card, "right");
    expect(testState.selectedCards[move.hand]).toEqual([move.card + 1]);
    deselectCard(testState, move.hand, move.card + 1); // clean up
  });
  it("If both selected, doesn't alter selection", () => {
    selectCard(testState, move.hand, move.card);
    selectCard(testState, move.hand, move.card + 1);
    expect(testState.selectedCards[move.hand]).toEqual([
      move.card,
      move.card + 1,
    ]);
    moveCard(testState, move.hand, move.card, "right");
    expect(testState.selectedCards[move.hand]).toEqual([
      move.card,
      move.card + 1,
    ]);
  });
});

describe("playCard", () => {
  const testState = getStartStateCopy();
  testState.board.infoTokens = 3;
  const cardIdx = 1;
  const prevHandSize = testState.board.hands[testState.currentPlayer].length;
  it("If valid, adds card to played piles from the hand", () => {
    const card: Card = {
      colour: "red",
      num: 1,
    };
    testState.board.hands[testState.currentPlayer][cardIdx] = card;
    playCard(testState, cardIdx, defaultConfig.infoTokens);
    expect(testState.board.piles[card.colour]).toEqual(card.num);
  });
  it("If invalid, adds card to discard pile from the hand and removes fuse token", () => {
    const card: Card = {
      colour: "green",
      num: 2,
    };
    testState.board.hands[testState.currentPlayer][cardIdx] = card;
    const prevFuseTokens = testState.board.fuseTokens;
    playCard(testState, cardIdx, defaultConfig.infoTokens);
    expect(testState.board.discardPile[card.colour]).toContain(card);
    expect(testState.board.fuseTokens).toEqual(prevFuseTokens - 1);
  });
  it("Adds an info token when completing a stack", () => {
    const prevInfoTokens = 3;
    testState.board.infoTokens = prevInfoTokens;
    const card: Card = {
      colour: "blue",
      num: maxCardNum,
    };
    testState.board.piles[card.colour] = maxCardNum - 1;
    testState.board.hands[testState.currentPlayer][cardIdx] = card;
    playCard(testState, cardIdx, defaultConfig.infoTokens);
    expect(testState.board.piles[card.colour]).toEqual(card.num);
    expect(testState.board.infoTokens).toEqual(prevInfoTokens + 1);
  });
  it("Draws a new card to replenish hand", () => {
    playCard(testState, cardIdx, defaultConfig.infoTokens);
    expect(testState.board.hands[testState.currentPlayer]).toHaveLength(
      prevHandSize,
    );
  });
});

describe("discardCard", () => {
  const testState = getStartStateCopy();
  const prevInfoTokens = 3;
  testState.board.infoTokens = prevInfoTokens;
  const cardIdx = 1;
  const card = testState.board.hands[testState.currentPlayer][cardIdx];
  const prevHandSize = testState.board.hands[testState.currentPlayer].length;
  discardCard(testState, cardIdx, defaultConfig.infoTokens);
  it("Moves card to discard pile", () => {
    expect(testState.board.discardPile[card.colour]).toContain(card);
  });
  it("Adds an info token", () => {
    expect(testState.board.infoTokens).toEqual(prevInfoTokens + 1);
  });
  it("Draws a new card to replenish hand", () => {
    expect(testState.board.hands[testState.currentPlayer]).toHaveLength(
      prevHandSize,
    );
  });
});

describe("advancePlayer", () => {
  it("Increases player number", () => {
    const testState = { ...startState };
    advancePlayer(
      testState,
      defaultConfig.royalFavour,
      testState.board.deck.length,
    );
    expect(testState.currentPlayer).toEqual(1);
  });
  it("Wraps to first player after last player", () => {
    const testState = {
      ...startState,
      currentPlayer: startState.board.hands.length - 1,
    };
    advancePlayer(
      testState,
      defaultConfig.royalFavour,
      testState.board.deck.length,
    );
    expect(testState.currentPlayer).toEqual(0);
  });
  it("Resets selection", () => {
    const testState = {
      ...startState,
      selectedCards: [[1], [2, 3], [], [], []],
    };
    advancePlayer(
      testState,
      defaultConfig.royalFavour,
      testState.board.deck.length,
    );
    expect(testState.selectedCards).toEqual(noSelectedCards);
  });
  it("Triggers end of game if not RF and deck is empty", () => {
    const testState = {
      ...startState,
      board: { ...startState.board, deck: [] },
    };
    const prevPlayer = testState.currentPlayer;
    advancePlayer(testState, defaultConfig.royalFavour, 1);
    expect(testState.finalPlayer).toEqual(prevPlayer);
  });
  it("Does not trigger end of game if RF and deck is empty", () => {
    const testState = {
      ...startState,
      board: { ...startState.board, deck: [] },
    };
    advancePlayer(testState, defaultConfig.royalFavour, 1);
    expect(testState.finalPlayer).toBeUndefined;
  });
});
