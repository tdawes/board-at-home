import * as _ from "lodash";
import { maxCardNum, noSelectedCards, State } from "../api";

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

export const drawCard = (state: State, cardIdx: number) => {
  const drawnCard = state.board.deck.shift();
  if (drawnCard) {
    state.board.hands[state.currentPlayer].splice(cardIdx, 0, drawnCard);
  }
};

export const selectCard = (state: State, handIdx: number, cardIdx: number) => {
  state.selectedCards[handIdx].push(cardIdx);
};

export const selectOnlyCard = (
  state: State,
  handIdx: number,
  cardIdx: number,
) => {
  state.selectedCards[handIdx] = [cardIdx];
};

export const deselectCard = (
  state: State,
  handIdx: number,
  cardIdx: number,
) => {
  state.selectedCards[handIdx] = state.selectedCards[handIdx].filter(
    idx => idx !== cardIdx,
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
  newPos: number,
) => {
  if (newPos < 0 || newPos >= state.board.hands[playerIdx].length) {
    throw new Error("Moving card out of bounds");
  }
  const card = state.board.hands[playerIdx][oldPos];
  state.board.hands[playerIdx].splice(oldPos, 1);
  state.board.hands[playerIdx].splice(newPos, 0, card);

  if (state.currentPlayer === playerIdx) {
    const selectedCard = state.selectedCards[playerIdx][0];
    if (oldPos === selectedCard) {
      selectOnlyCard(state, playerIdx, newPos);
    } else if (oldPos < selectedCard && newPos >= selectedCard) {
      selectOnlyCard(state, playerIdx, selectedCard - 1);
    } else if (oldPos > selectedCard && newPos <= selectedCard) {
      selectOnlyCard(state, playerIdx, selectedCard + 1);
    }
  } else {
    const selected = state.selectedCards[playerIdx];
    const newSelected: number[] = [];
    selected.map(prevSelected => {
      if (oldPos === prevSelected) {
        newSelected.push(newPos);
      } else if (prevSelected > oldPos && prevSelected <= newPos) {
        newSelected.push(prevSelected - 1);
      } else if (prevSelected < oldPos && prevSelected >= newPos) {
        newSelected.push(prevSelected + 1);
      } else {
        newSelected.push(prevSelected);
      }
    });
    state.selectedCards[playerIdx] = newSelected;
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
    if (card.num === maxCardNum) {
      addInfoToken(state, maxInfoTokens);
    }
  } else {
    state.board.discardPile[card.colour].push(card);
    state.board.fuseTokens -= 1;
  }
  drawCard(state, cardIdx);
};

export const discardCard = (
  state: State,
  cardIdx: number,
  maxInfoTokens: number,
) => {
  const card = state.board.hands[state.currentPlayer].splice(cardIdx, 1)[0];
  state.board.discardPile[card.colour].splice(
    _.sortedIndexBy(
      state.board.discardPile[card.colour],
      card,
      card => -card.num,
    ),
    0,
    card,
  );
  addInfoToken(state, maxInfoTokens);
  drawCard(state, cardIdx);
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
