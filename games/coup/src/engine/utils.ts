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
