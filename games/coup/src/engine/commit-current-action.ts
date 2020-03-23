import { State } from "../api";
import { nextPlayer } from "./utils";
import { completeMove } from "./complete-move";

export default (state: State) => {
  if (state.currentReaction != null) {
    state.currentAction = undefined;
    state.currentReaction = undefined;
    nextPlayer(state);
  } else if (state.currentAction != null) {
    completeMove(
      state,
      state.currentAction.action.playerId,
      state.currentAction.action.action,
    );
  } else {
    nextPlayer(state);
  }
};
