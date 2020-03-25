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
  maxCardNum,
  noSelectedCards,
} from "../api";
import * as _ from "lodash";
import produce from "immer";
import { isFinished, getInitialBoard } from "./board";

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
      const prevDeckSize = state.board.deck.length;
      // Reordering or selecting cards does not finish your turn, everything else does
      if (action.type === "move") {
        const playerIdx = Object.keys(getGame().players).indexOf(playerId);
        const playerHand = state.board.hands[playerIdx];
        const card = playerHand[action.cardIdx];

        playerHand.splice(action.cardIdx, 1);
        const newPos =
          action.direction == "right" ? action.cardIdx + 1 : action.cardIdx - 1;
        playerHand.splice(newPos, 0, card);

        const selectedInHand = state.selectedCards[playerIdx];
        if (
          selectedInHand.includes(action.cardIdx) &&
          !selectedInHand.includes(newPos)
        ) {
          state.selectedCards[playerIdx] = selectedInHand.filter(
            idx => idx != action.cardIdx,
          );
          state.selectedCards[playerIdx].push(newPos);
        } else if (
          selectedInHand.includes(newPos) &&
          !selectedInHand.includes(action.cardIdx)
        ) {
          state.selectedCards[playerIdx] = selectedInHand.filter(
            idx => idx != newPos,
          );
          state.selectedCards[playerIdx].push(action.cardIdx);
        }
      } else if (action.type === "select") {
        const selectedInHand = state.selectedCards[action.handIdx];
        if (selectedInHand.includes(action.cardIdx)) {
          state.selectedCards[action.handIdx] = selectedInHand.filter(
            c => c != action.cardIdx,
          );
        } else {
          state.selectedCards[action.handIdx].push(action.cardIdx);
        }
      } else {
        const currentHand = state.board.hands[state.currentPlayer];
        const maxInfoTokens = getGame().config.infoTokens;

        if (action.type === "play") {
          const card = currentHand.splice(action.cardIdx, 1)[0];
          if (state.board.piles[card.color] === card.num - 1) {
            state.board.piles[card.color] = card.num;
            if (
              card.num == maxCardNum &&
              state.board.infoTokens < maxInfoTokens
            ) {
              state.board.infoTokens += 1;
            }
          } else {
            state.board.discardPile[card.color].push(card);
            state.board.fuseTokens -= 1;
          }

          const drawnCard = state.board.deck.shift();
          if (drawnCard) {
            currentHand.push(drawnCard);
          }
        } else if (action.type === "discard") {
          const card = currentHand.splice(action.cardIdx, 1)[0];
          state.board.discardPile[card.color].push(card);
          if (state.board.infoTokens < maxInfoTokens) {
            state.board.infoTokens += 1;
          }

          const drawnCard = state.board.deck.shift();
          if (drawnCard) {
            currentHand.push(drawnCard);
          }
        } else if (action.type === "info") {
          if (state.board.infoTokens <= 0) {
            throw new Error("No information tokens left.");
          }
          state.board.infoTokens -= 1;
        }

        const royalFavor = getGame().config.royalFavor;
        if (
          isFinished(
            state.board,
            state.currentPlayer,
            royalFavor,
            state.finalPlayer,
          )
        ) {
          state.finished = true;
        } else {
          if (
            !royalFavor &&
            prevDeckSize === 1 &&
            state.board.deck.length === 0
          ) {
            state.finalPlayer = state.currentPlayer;
          }

          state.currentPlayer =
            (state.currentPlayer + 1) % getNumPlayers(getGame());
          state.selectedCards = noSelectedCards;
        }
      }
    }),
};
export default engine;
