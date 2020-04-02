import { GameEngine, StartedGame, UnstartedGame } from "@board-at-home/api";
import produce from "immer";
import _ from "lodash";
import { Action, Card, Config, Hand, State } from "../api";
import acceptMove from "./accept-move";
import challenge from "./challenge";
import commitCurrentAction from "./commit-current-action";
import discard from "./discard";
import forceReplace from "./force-replace";
import forceReplaceCancel from "./force-replace-cancel";
import loseInfluence from "./lose-influence";
import play from "./play";
import react from "./react";
import respondToChallenge from "./respond-to-challenge";
import reveal from "./reveal";

const newDeck = (numberOfEachCard: number, useExpansion: boolean) =>
  _.flatten(
    [
      "duke",
      "assassin",
      "captain",
      "contessa",
      useExpansion ? "inquisitor" : "ambassador",
    ].map(card => _.range(numberOfEachCard).map(() => card)),
  ) as Card[];

const checkForWinner = (state: State) => {
  const activePlayers = state.playerOrder.filter(
    player => state.players[player].liveCards.length >= 1,
  );
  if (activePlayers.length <= 1) {
    state.finished = true;
    state.winner = activePlayers[0];
  }
};

const engine: GameEngine<State, Action, Config> = {
  isFull: () => false,
  start: (game: UnstartedGame, config: Config) => {
    if (Object.keys(game.players).length < 2) {
      throw new Error("Game is not full.");
    }
    const deck = _.shuffle(
      newDeck(config.numberOfEachCard, config.useExpansion),
    );
    const teams = _.range(Object.keys(game.players).length).map(i =>
      config.useExpansion && i % 2 === 0 ? "loyalist" : "reformist",
    );
    const playerOrder = _.shuffle(Object.keys(game.players));
    const players = playerOrder.reduce(
      (acc, playerId, i) => ({
        ...acc,
        [playerId]: {
          team: teams[i],
          deadCards: [],
          liveCards: [deck.pop(), deck.pop()],
          money: 2,
        } as Hand,
      }),
      {},
    );
    return {
      players,
      deck,
      finished: false,
      playerOrder,
      currentPlayer: 0,
      treasury: 0,
      requiredUserInputs: _.mapValues(players, () => []),
      history: [],
    };
  },
  applyPlayerAction: (
    getGame: () => StartedGame<State, Config>,
    playerId: string,
    action: Action,
    triggerServerAction: (action: Action, playerId: string) => void,
  ) =>
    produce(getGame().state, state => {
      state.history.push({ playerId, action });
      if (action.type === "play") {
        play(state, playerId, action, triggerServerAction, getGame);
      } else if (action.type === "react") {
        react(state, playerId, action, triggerServerAction, getGame);
      } else if (action.type === "challenge") {
        challenge(state, playerId, action.id);
      } else if (action.type === "accept") {
        acceptMove(state, playerId, action.id);
      } else if (action.type === "discard") {
        discard(state, playerId, action.cards);
      } else if (action.type === "force-replace") {
        forceReplace(state, playerId, action.target, action.card);
      } else if (action.type === "force-replace-cancel") {
        forceReplaceCancel(state, playerId, action.target, action.card);
      } else if (action.type === "lose-influence") {
        loseInfluence(state, playerId, action.card);
      } else if (action.type === "respond-to-challenge") {
        respondToChallenge(
          state,
          playerId,
          action.challenger,
          action.succeed,
          action.condition,
        );
      } else if (action.type === "reveal") {
        reveal(state, playerId, action.target, action.card);
      } else if (action.type === "commit") {
        commitCurrentAction(state);
      }
      checkForWinner(state);
    }),
};
export default engine;
