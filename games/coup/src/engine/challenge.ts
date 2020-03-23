import { State } from "../api";
import { conditionFromAction } from "../utils";

export default (state: State, playerId: string, id: string) => {
  if (state.currentAction == null) {
    throw new Error("Nothing to challenge.");
  } else if (state.currentChallenge != null) {
    throw new Error("Someone has already challenged.");
  }

  const challengedAction = state.currentReaction || state.currentAction;
  if (id !== challengedAction.id) {
    // Something has changed
    return;
  }
  if (challengedAction.playerId === playerId) {
    throw new Error("Cannot challenge your own action.");
  }

  state.currentChallenge = { playerId };
  state.requiredUserInputs[challengedAction.playerId].push({
    type: "respond-to-challenge",
    condition: conditionFromAction(challengedAction.action),
  });
};
