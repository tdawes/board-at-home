import _ from "lodash";
import { State, Move } from "../api";
import { nextPlayer, killPlayer } from "./utils";

const collectIncome = (state: State, playerId: string) => {
  state.players[playerId].money += 1;
};

const collectForeignAid = (state: State, playerId: string) => {
  state.players[playerId].money += 2;
};

const killCard = (state: State, target: string) => {
  const targetHand = state.players[target];
  if (targetHand.liveCards.length <= 1) {
    killPlayer(state, target);
  } else {
    state.requiredUserInputs[target].push({ type: "lose-influence" });
  }
};

const coup = (state: State, target: string) => {
  killCard(state, target);
};

const collectTax = (state: State, playerId: string) => {
  state.players[playerId].money += 3;
};

const assassinate = (state: State, target: string) => {
  killCard(state, target);
};

const steal = (state: State, playerId: string, target: string) => {
  const amountToSteal = Math.min(state.players[target].money, 2);
  state.players[playerId].money += amountToSteal;
  state.players[target].money -= amountToSteal;
};

const exchange = (state: State, playerId: string, amount: number) => {
  state.players[playerId].liveCards.push(
    ..._.range(amount).map(() => state.deck.pop()!),
  );
  state.requiredUserInputs[playerId].push({ type: "discard-card", amount });
};

const convert = (state: State, target: string, cost: number) => {
  const team = state.players[target].team;
  const otherTeam = team === "loyalist" ? "reformist" : "loyalist";
  state.players[target].team = otherTeam;
  state.treasury += cost;
};

const embezzle = (state: State, playerId: string) => {
  state.players[playerId].money += state.treasury;
  state.treasury = 0;
};

const examine = (state: State, playerId: string, target: string) => {
  state.requiredUserInputs[target].push({
    type: "reveal-card",
    target: playerId,
  });
};

export const completeMove = (state: State, playerId: string, move: Move) => {
  if (move.type === "income") {
    collectIncome(state, playerId);
  } else if (move.type === "foreign-aid") {
    collectForeignAid(state, playerId);
  } else if (move.type === "coup") {
    coup(state, move.target);
  } else if (move.type === "tax") {
    collectTax(state, playerId);
  } else if (move.type === "assassinate") {
    assassinate(state, move.target);
  } else if (move.type === "steal") {
    steal(state, playerId, move.target);
  } else if (move.type === "exchange-2") {
    exchange(state, playerId, 2);
  } else if (move.type === "convert") {
    convert(
      state,
      "target" in move ? move.target : playerId,
      "target" in move ? 2 : 1,
    );
  } else if (move.type === "embezzle") {
    embezzle(state, playerId);
  } else if (move.type === "examine") {
    examine(state, playerId, move.target);
  } else if (move.type === "exchange-1") {
    exchange(state, playerId, 1);
  }
  state.currentAction = undefined;
  state.currentReaction = undefined;
  state.currentChallenge = undefined;
  nextPlayer(state);
};
