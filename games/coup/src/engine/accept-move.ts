import { State } from "../api";
import commitCurrentAction from "./commit-current-action";

export default (state: State, playerId: string, id: string) => {
  const currentAction = state.currentReaction || state.currentAction;

  if (currentAction != null) {
    if (id !== currentAction.id) {
      // Something has changed.
      return;
    }
    currentAction.accepted[playerId] = true;
    if (
      state.playerOrder
        .filter(playerId => state.players[playerId].liveCards.length > 0)
        .every(playerId => currentAction.accepted[playerId])
    ) {
      commitCurrentAction(state);
    }
  } else {
    throw new Error("Nothing to approve.");
  }
};
