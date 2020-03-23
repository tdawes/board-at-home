import { State, ChallengeCondition } from "../api";
import _ from "lodash";
import commitCurrentAction from "./commit-current-action";
import { killPlayer } from "./utils";

export default (
  state: State,
  playerId: string,
  challenger: string,
  succeed: boolean,
  condition: ChallengeCondition,
) => {
  if (
    !state.requiredUserInputs[playerId].some(
      event => event.type === "respond-to-challenge",
    )
  ) {
    throw new Error("Player does not have to respond to a challenge.");
  }
  if (succeed) {
    const playerHand = state.players[playerId];
    if (condition.type === "must-have") {
      if (!playerHand.liveCards.includes(condition.card)) {
        throw new Error("Failed the challenge.");
      }
      playerHand.liveCards.splice(
        playerHand.liveCards.indexOf(condition.card),
        1,
      );
      state.deck.push(condition.card);
      state.deck = _.shuffle(state.deck);
      playerHand.liveCards.push(state.deck.pop()!);
    }
    if (state.players[challenger].liveCards.length <= 1) {
      killPlayer(state, challenger);
    } else {
      state.requiredUserInputs[challenger].push({ type: "lose-influence" });
    }
    // Challenge was unsuccessful, so commit the action
    commitCurrentAction(state);
  } else {
    if (state.players[playerId].liveCards.length <= 1) {
      killPlayer(state, playerId);
    } else {
      state.requiredUserInputs[playerId].push({ type: "lose-influence" });
    }
    if (state.currentReaction != null) {
      // Reaction was successfully challenged, so commit the action
      state.currentReaction = undefined;
    } else {
      // Action was successfully challenged, so discard it and move on
      state.currentAction = undefined;
    }
    commitCurrentAction(state);
  }

  state.requiredUserInputs[playerId].splice(
    state.requiredUserInputs[playerId].findIndex(
      event => event.type === "respond-to-challenge",
    ),
    1,
  );
  state.currentChallenge = undefined;
};
