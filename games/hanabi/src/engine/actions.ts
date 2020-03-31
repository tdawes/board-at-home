import { State, noSelectedCards, maxCardNum } from "../api";
import * as _ from "lodash";

export const addInfoToken = (state: State, maxInfoTokens: number) => {
  if (state.board.infoTokens < maxInfoTokens) {
    state.board.infoTokens += 1;
  }
};

export const removeInfoToken = (state: State) => {
  if (state.board.infoTokens <= 0) {
    throw new Error("No information tokens left.");
  }
  state.board.infoTokens -= 1;
};

export const drawCard = (state: State) => {
  const drawnCard = state.board.deck.shift();
  if (drawnCard) {
    state.board.hands[state.currentPlayer].push(drawnCard);
  }
};

export const selectCard = (state: State, handIdx: number, cardIdx: number) => {
  state.selectedCards[handIdx].push(cardIdx);
};

export const deselectCard = (
  state: State,
  handIdx: number,
  cardIdx: number,
) => {
  state.selectedCards[handIdx] = state.selectedCards[handIdx].filter(
    idx => idx != cardIdx,
  );
};

export const toggleCardSelection = (
  state: State,
  handIdx: number,
  cardIdx: number,
) => {
  if (state.selectedCards[handIdx].includes(cardIdx)) {
    deselectCard(state, handIdx, cardIdx);
  } else {
    selectCard(state, handIdx, cardIdx);
  }
};

export const moveCard = (
  state: State,
  playerIdx: number,
  oldPos: number,
  direction: "left" | "right",
) => {
  const newPos = direction == "right" ? oldPos + 1 : oldPos - 1;
  if (newPos < 0 || newPos >= state.board.hands[playerIdx].length) {
    throw new Error("Moving card out of bounds");
  }
  const card = state.board.hands[playerIdx][oldPos];
  state.board.hands[playerIdx].splice(oldPos, 1);
  state.board.hands[playerIdx].splice(newPos, 0, card);

  const selected = state.selectedCards[playerIdx];
  if (selected.includes(oldPos) != selected.includes(newPos)) {
    toggleCardSelection(state, playerIdx, oldPos);
    toggleCardSelection(state, playerIdx, newPos);
  }
};

export const playCard = (
  state: State,
  cardIdx: number,
  maxInfoTokens: number,
) => {
  const card = state.board.hands[state.currentPlayer].splice(cardIdx, 1)[0];
  if (state.board.piles[card.colour] === card.num - 1) {
    state.board.piles[card.colour] = card.num;
    if (card.num == maxCardNum) {
      addInfoToken(state, maxInfoTokens);
    }
  } else {
    state.board.discardPile[card.colour].push(card);
    state.board.fuseTokens -= 1;
  }
  drawCard(state);
};

export const discardCard = (
  state: State,
  cardIdx: number,
  maxInfoTokens: number,
) => {
  const card = state.board.hands[state.currentPlayer].splice(cardIdx, 1)[0];
  state.board.discardPile[card.colour].splice(
    _.sortedIndexBy(state.board.discardPile[card.colour], card, "num"),
    0,
    card,
  );
  addInfoToken(state, maxInfoTokens);
  drawCard(state);
};

export const advancePlayer = (
  state: State,
  royalFavour: boolean,
  prevDeckSize: number,
) => {
  const drewLastCard = prevDeckSize === 1 && state.board.deck.length === 0;
  if (!royalFavour && drewLastCard) {
    state.finalPlayer = state.currentPlayer;
  }
  state.currentPlayer = (state.currentPlayer + 1) % state.board.hands.length;
  state.selectedCards = noSelectedCards;
};
