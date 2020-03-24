import { GameEngine, UnstartedGame, StartedGame } from "@board-at-home/api";
import { State, Action, Config, Board, Card } from "../api";
import { createDeck, deal } from "./deck";
import * as _ from "lodash";
import produce from "immer";

const checkForFinish = (
  board: Board,
  currentPlayer: number,
  finalPlayer?: number,
) => {
  // TODO Check if game is impossible to win? (Have this as config option?)
  // e.g. if you discard both blue 3; or allow to continue for score?
  // Otherwise play continues until the deck becomes empty, and for one full round after that.
  return (
    _.every(Object.values(board.piles), num => num === 5) ||
    board.fuseTokens <= 0 ||
    (board.deck.length === 0 && currentPlayer === finalPlayer)
  );
};

const engine: GameEngine<State, Action, Config> = {
  isFull: (game: UnstartedGame) => Object.keys(game.players).length > 5, // 2-5
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
        infoTokens: config.infoTokens,
        fuseTokens: config.fuseTokens,
      },
      finished: false,
      currentPlayer: 0,
      selectedCards: [[], [], [], [], []],
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
        const card = state.board.hands[playerIdx][action.cardIdx];
        state.board.hands[playerIdx].splice(action.cardIdx, 1);
        const newPos =
          action.direction == "right" ? action.cardIdx + 1 : action.cardIdx - 1;
        state.board.hands[playerIdx].splice(newPos, 0, card);
        if (
          state.selectedCards[playerIdx].includes(action.cardIdx) &&
          !state.selectedCards[playerIdx].includes(newPos)
        ) {
          state.selectedCards[playerIdx] = state.selectedCards[
            playerIdx
          ].filter(c => c != action.cardIdx);
          state.selectedCards[playerIdx].push(newPos);
        }
      } else if (action.type === "select") {
        if (state.selectedCards[action.handIdx].includes(action.cardIdx)) {
          state.selectedCards[action.handIdx] = state.selectedCards[
            action.handIdx
          ].filter(c => c != action.cardIdx);
        } else {
          state.selectedCards[action.handIdx].push(action.cardIdx);
        }
      } else {
        const prevDeckSize = state.board.deck.length;
        if (action.type === "play") {
          const card = state.board.hands[state.currentPlayer].splice(
            action.cardIdx,
            1,
          )[0];
          if (state.board.piles[card.color] === card.num - 1) {
            state.board.piles[card.color] = card.num;
            if (
              card.num == 5 &&
              state.board.infoTokens < getGame().config.infoTokens
            ) {
              state.board.infoTokens += 1;
            }
          } else {
            state.board.discardPile.push(card);
            state.board.fuseTokens -= 1;
          }
          const drawnCard = state.board.deck.shift();
          if (drawnCard) {
            // The newly drawn card will always be the rightmost one
            state.board.hands[state.currentPlayer].push(drawnCard);
          }
        } else if (action.type === "discard") {
          const card = state.board.hands[state.currentPlayer].splice(
            action.cardIdx,
            1,
          )[0];
          state.board.discardPile.push(card);
          if (state.board.infoTokens < getGame().config.infoTokens) {
            state.board.infoTokens += 1;
          }
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
        if (
          checkForFinish(state.board, state.currentPlayer, state.finalPlayer)
        ) {
          state.finished = true;
        }
        if (prevDeckSize == 1 && state.board.deck.length === 0) {
          state.finalPlayer = state.currentPlayer;
        }
        state.currentPlayer =
          (state.currentPlayer + 1) % Object.keys(getGame().players).length;
        state.selectedCards = [[], [], [], [], []];
      }
    }),
};
export default engine;
