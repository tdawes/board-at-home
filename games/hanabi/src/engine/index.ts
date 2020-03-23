import { GameEngine, UnstartedGame, StartedGame } from "@board-at-home/api";
import { State, Action, Config, Board, Card } from "../api";
import { createDeck, deal } from "./deck";
import * as _ from "lodash";
import produce from "immer";

const checkForFinish = (board: Board) => {
  // TODO Check if game is impossible to win? (Have this as config option?)
  // e.g. if you discard both blue 3; or allow to continue for score?
  return (
    _.every(Object.values(board.piles), num => num == 5) ||
    board.fuseTokens <= 0
  );
};

const MAX_INFO_TOKENS = 8;
const MAX_FUSE_TOKENS = 3;

const engine: GameEngine<State, Action, Config> = {
  isFull: (game: UnstartedGame) => Object.keys(game.players).length >= 2, // 2-5
  start: (game: UnstartedGame, config: Config) => {
    console.log(
      game.players,
      Object.keys(game.players),
      Object.keys(game.players).length,
      config,
    );
    if (Object.keys(game.players).length > 5) {
      throw new Error("Game is too full.");
    }
    if (Object.keys(game.players).length < 2) {
      throw new Error("Game is not full.");
    }
    const deck: Card[] = createDeck();
    const hands: Card[][] = deal(deck, Object.keys(game.players).length);
    return {
      board: {
        piles: { red: 0, green: 0, blue: 0, white: 0, yellow: 0 },
        discardPile: [],
        deck,
        hands,
        infoTokens: MAX_INFO_TOKENS,
        fuseTokens: MAX_FUSE_TOKENS,
      },
      finished: false,
      currentPlayer: 0,
    };
  },
  applyPlayerAction: (
    game: StartedGame<State, Config>,
    _playerId: string,
    action: Action,
  ) =>
    produce(game.state, state => {
      if (action.type === "play") {
        const card = state.board.hands[state.currentPlayer].splice(
          action.cardIdx,
          1,
        )[0];
        if (state.board.piles[card.color] === card.num - 1) {
          state.board.piles[card.color] = card.num;
          if (card.num == 5 && state.board.infoTokens < MAX_INFO_TOKENS) {
            state.board.infoTokens += 1;
          }
        } else {
          state.board.discardPile.push(card);
          state.board.fuseTokens -= 1;
        }
        // TODO maintain order, or allow user to reorder and make notes?
        // At least clarify which card is newly drawn?
        const drawnCard = state.board.deck.shift();
        if (drawnCard) {
          state.board.hands[state.currentPlayer].push(drawnCard);
        }
      } else if (action.type === "discard") {
        const card = state.board.hands[state.currentPlayer].splice(
          action.cardIdx,
          1,
        )[0];
        state.board.discardPile.push(card);
        if (state.board.infoTokens < MAX_INFO_TOKENS) {
          state.board.infoTokens += 1;
        }
        // TODO maintain order, or allow user to reorder and make notes?
        // At least clarify which card is newly drawn?
        const drawnCard = state.board.deck.shift();
        if (drawnCard) {
          state.board.hands[state.currentPlayer].push(drawnCard);
        }
      } else if (action.type === "info") {
        if (state.board.infoTokens <= 0) {
          throw new Error("No information tokens left.");
        }
        state.board.infoTokens -= 1;
      }
      if (checkForFinish(state.board)) {
        state.finished = true;
      }
      state.currentPlayer =
        (state.currentPlayer + 1) % Object.keys(game.players).length;
    }),
};
export default engine;
