import { PlayAction, State, Move, Action, Config } from "../api";
import _ from "lodash";
import { completeMove } from "./complete-move";
import { StartedGame } from "@board-at-home/api/src";
import { v4 as uuid } from "uuid";
import { REACT_TIME } from "./utils";

const UNBLOCKABLE_ACTIONS: Move["type"][] = ["income", "coup", "convert"];

const deductMoney = (state: State, playerId: string, money: number) => {
  if (state.players[playerId].money < money) {
    throw new Error("Not enough money.");
  }
  state.players[playerId].money -= money;
};

const beginMove = (state: State, playerId: string, move: Move) => {
  if (move.type === "coup") {
    deductMoney(state, playerId, 7);
  } else if (move.type === "assassinate") {
    deductMoney(state, playerId, 3);
  } else if (move.type === "convert") {
    if ("target" in move) {
      deductMoney(state, playerId, 2);
    } else {
      deductMoney(state, playerId, 1);
    }
  }
};

export default (
  state: State,
  playerId: string,
  action: PlayAction,
  triggerServerAction: (action: Action, playerId: string) => void,
  getGame: () => StartedGame<State, Config>,
) => {
  if (state.currentAction != null) {
    throw new Error("The last action has not been resolved.");
  }
  const move = action.action;
  const id = uuid();
  state.currentAction = {
    id,
    playerId,
    action: action as any,
    accepted: { [playerId]: true },
  };
  beginMove(state, playerId, move);
  if (UNBLOCKABLE_ACTIONS.includes(move.type)) {
    // Can't be blocked, resolve immediately.
    completeMove(state, playerId, move);
  } else {
    // Can be blocked, so defer completion;
    setTimeout(() => {
      const game = getGame();
      if (
        game.state.currentAction != null &&
        game.state.currentAction.id === id &&
        game.state.currentChallenge == null &&
        game.state.currentReaction == null
      ) {
        triggerServerAction(
          {
            type: "commit",
          },
          playerId,
        );
      }
    }, REACT_TIME);
  }
};
