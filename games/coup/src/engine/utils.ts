import { State } from "../api";

export const nextPlayer = (state: State) => {
  let counter = state.playerOrder.length;
  while (counter > 0) {
    state.currentPlayer = (state.currentPlayer + 1) % state.playerOrder.length;
    if (
      state.players[state.playerOrder[state.currentPlayer]].liveCards.length > 0
    ) {
      break;
    }
    counter--;
  }
};

export const killPlayer = (state: State, playerId: string) => {
  const playerHand = state.players[playerId];
  playerHand.deadCards.push(...playerHand.liveCards);

  playerHand.liveCards = [];
  playerHand.money = 0;
  state.requiredUserInputs[playerId] = [];
};

export const REACT_TIME = 15 * 1000;
