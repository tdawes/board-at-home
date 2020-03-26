import {
  GameEngine,
  UnstartedGame,
  StartedGame,
  BaseGame,
} from "@board-at-home/api";
import {
  State,
  Action,
  Config,
  maxPlayers,
  minPlayers,
  noSelectedCards,
} from "../api";
import * as _ from "lodash";
import produce from "immer";
import { isFinished, getInitialBoard } from "./board";
import {
  moveCard,
  toggleCardSelection,
  playCard,
  discardCard,
  removeInfoToken,
  advancePlayer,
} from "./actions";

const getNumPlayers = (game: BaseGame) => Object.keys(game.players).length;

const engine: GameEngine<State, Action, Config> = {
  isFull: (game: UnstartedGame) => getNumPlayers(game) > maxPlayers,
  start: (game: UnstartedGame, config: Config) => {
    const numPlayers = getNumPlayers(game);
    if (numPlayers > maxPlayers) {
      throw new Error("Game is too full.");
    }
    if (numPlayers < minPlayers) {
      throw new Error("Game is not full.");
    }
    return {
      board: getInitialBoard(numPlayers, config),
      finished: false,
      currentPlayer: 0,
      selectedCards: noSelectedCards,
    };
  },
  applyPlayerAction: (
    getGame: () => StartedGame<State, Config>,
    playerId: string,
    action: Action,
  ) =>
    produce(getGame().state, state => {
      // Reordering or selecting cards does not finish your turn, everything else does
      if (action.type === "move") {
        const playerIdx = Object.keys(getGame().players).indexOf(playerId);
        moveCard(state, playerIdx, action.cardIdx, action.direction);
      } else if (action.type === "select") {
        toggleCardSelection(state, action.handIdx, action.cardIdx);
      } else {
        const prevDeckSize = state.board.deck.length;
        const maxInfoTokens = getGame().config.infoTokens;
        if (action.type === "play") {
          playCard(state, action.cardIdx, maxInfoTokens);
        } else if (action.type === "discard") {
          discardCard(state, action.cardIdx, maxInfoTokens);
        } else if (action.type === "info") {
          removeInfoToken(state);
        }

        const isRf = getGame().config.royalFavor;
        if (
          isFinished(state.board, state.currentPlayer, isRf, state.finalPlayer)
        ) {
          state.finished = true;
        } else {
          advancePlayer(state, isRf, prevDeckSize);
        }
      }
    }),
};

export default engine;
