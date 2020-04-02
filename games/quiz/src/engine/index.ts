import { GameEngine, StartedGame, UnstartedGame } from "@board-at-home/api";
import produce from "immer";
import _ from "lodash";
import { Action, Config, State } from "../api";

const engine: GameEngine<State, Action, Config> = {
  isFull: () => false,
  start: (game: UnstartedGame, config: Config) => {
    if (Object.keys(game.players).length < 2) {
      throw new Error("Game is not full.");
    }
    return {
      playerOrder: Object.keys(game.players).filter(
        player => player !== config.quizMaster,
      ),
      locked: false,
      answers: {},
    };
  },
  applyPlayerAction: (
    getGame: () => StartedGame<State, Config>,
    playerId: string,
    action: Action,
  ) =>
    produce(getGame().state, state => {
      if (action.type === "submit") {
        state.answers[playerId] = action.answer;
      } else if (action.type === "lock-in") {
        if (playerId === getGame().config.quizMaster) {
          state.locked = true;
        }
      } else if (action.type === "clear") {
        if (playerId === getGame().config.quizMaster) {
          state.locked = false;
          state.answers = {};
        }
      }
    }),
};
export default engine;
