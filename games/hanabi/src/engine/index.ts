import { GameEngine, UnstartedGame, StartedGame } from "@board-at-home/api";
import { State, Action, Config, Board, Card } from "../api";
import { createDeck, deal, cannotCompleteEverySet } from "./deck";
import * as _ from "lodash";
import produce from "immer";

// Completing all sets to 5 immediately wins the game.
// You always lose if you run out of fuse tokens.
// Otherwise play continues until the deck becomes empty, and for one full round after that.
// The Royal Favor variant doesn't use scoring and players keep on playing even after the deck is gone, having potentially fewer cards in hands.
// Completing all fireworks till 5 is a win, anything else is a loss for all players.
// The game ends immediately when a player would start a turn with no cards in hand.

const checkForFinish = (
  board: Board,
  currentPlayer: number,
  royalFavor: boolean,
  finalPlayer?: number,
) => {
  const won = _.every(Object.values(board.piles), num => num === 5);
  const lost =
    board.fuseTokens <= 0 || royalFavor
      ? board.hands[currentPlayer].length === 0 ||
        cannotCompleteEverySet(board.discardPile)
      : board.deck.length === 0 && currentPlayer === finalPlayer;
  return won || lost;
};

const noSelectedCards = [[], [], [], [], []];
const maxPlayers = 5;
const minPlayers = 2;
const engine: GameEngine<State, Action, Config> = {
  isFull: (game: UnstartedGame) =>
    Object.keys(game.players).length > maxPlayers,
  start: (game: UnstartedGame, config: Config) => {
    const numPlayers = Object.keys(game.players).length;
    if (numPlayers > maxPlayers) {
      throw new Error("Game is too full.");
    }
    if (numPlayers < minPlayers) {
      throw new Error("Game is not full.");
    }
    const deck: Card[] = createDeck();
    return {
      board: {
        piles: { red: 0, green: 0, blue: 0, white: 0, yellow: 0 },
        discardPile: { red: [], green: [], blue: [], white: [], yellow: [] },
        deck,
        hands: deal(deck, numPlayers),
        infoTokens: config.infoTokens,
        fuseTokens: config.fuseTokens,
      },
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
            state.board.discardPile[card.color].push(card);
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
          state.board.discardPile[card.color].push(card);
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
        const royalFavor = getGame().config.royalFavor;
        if (
          checkForFinish(
            state.board,
            state.currentPlayer,
            royalFavor,
            state.finalPlayer,
          )
        ) {
          state.finished = true;
        }
        if (!royalFavor && prevDeckSize == 1 && state.board.deck.length === 0) {
          state.finalPlayer = state.currentPlayer;
        }
        state.currentPlayer =
          (state.currentPlayer + 1) % Object.keys(getGame().players).length;
        state.selectedCards = noSelectedCards;
      }
    }),
};
export default engine;
