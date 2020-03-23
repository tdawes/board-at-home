import {
  ChallengeCondition,
  PlayAction,
  ReactAction,
  Card,
  State,
} from "./api";

export const mustHave = (card: Card): ChallengeCondition => ({
  type: "must-have",
  card,
});
export const mustNotHave = (card: Card): ChallengeCondition => ({
  type: "must-not-have",
  card,
});

export const conditionFromAction = (
  action: PlayAction | ReactAction,
): ChallengeCondition => {
  if (action.type === "play") {
    const move = action.action;
    if (move.type === "tax") {
      return mustHave("duke");
    } else if (move.type === "assassinate") {
      return mustHave("assassin");
    } else if (move.type === "steal") {
      return mustHave("captain");
    } else if (move.type === "exchange-2") {
      return mustHave("ambassador");
    } else if (move.type === "exchange-1") {
      return mustHave("inquisitor");
    } else if (move.type === "embezzle") {
      return mustNotHave("duke");
    }
  } else if (action.type === "react") {
    return mustHave(action.card);
  }
  throw new Error("Cannot challenge this action");
};

export const isCurrentPlayer = (state: State, playerId: string) =>
  state.playerOrder[state.currentPlayer] === playerId;
