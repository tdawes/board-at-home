import { State, ReactAction, Config, Action } from "../api";
import { StartedGame } from "@board-at-home/api";
import { v4 as uuid } from "uuid";

export default (
  state: State,
  playerId: string,
  action: ReactAction,
  triggerServerAction: (action: Action, playerId: string) => void,
  getGame: () => StartedGame<State, Config>,
) => {
  if (state.currentAction == null) {
    throw new Error("Cannot react since no-one has played yet.");
  } else if (state.currentAction.playerId === playerId) {
    throw new Error("Cannot react to your own action.");
  } else if (state.currentReaction != null) {
    throw new Error("Someone else reacted first.");
  } else if (state.currentChallenge != null) {
    throw new Error("Cannot react to a challenged action.");
  }

  const { currentAction } = state;
  if (currentAction.action.action.type === "foreign-aid") {
    if (action.card !== "duke") {
      throw new Error("You can only block foreign aid with a duke.");
    }
  } else if (currentAction.action.action.type === "assassinate") {
    if (action.card !== "contessa") {
      throw new Error("You can only block an assassination with a contessa.");
    }
  } else if (currentAction.action.action.type === "steal") {
    if (
      action.card !== "captain" &&
      action.card !== "ambassador" &&
      action.card !== "inquisitor"
    ) {
      throw new Error("You cannot block stealing with this card.");
    }
  } else {
    throw new Error("Can't block this action.");
  }
  const id = uuid();
  state.currentReaction = {
    id,
    playerId,
    action,
    accepted: { [playerId]: true },
  };

  setTimeout(() => {
    const game = getGame();
    if (
      game.state.currentReaction != null &&
      game.state.currentReaction.id === id &&
      game.state.currentChallenge == null
    ) {
      triggerServerAction({ type: "commit" }, playerId);
    }
  }, 5 * 1000);
};
