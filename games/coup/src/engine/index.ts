import { GameEngine, UnstartedGame, StartedGame } from "@board-at-home/api";
import { State, Action, Config, Hand, Card } from "../api";
import * as _ from "lodash";

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
    ((game as any) as StartedGame<State>).started = true;
    ((game as any) as StartedGame<State>).state = {
      players,
      deck,
      finished: false,
      playerOrder,
      currentPlayer: 0,
      treasury: 0,
      stack: [],
    };
  },
  applyPlayerAction: (
    game: StartedGame<State>,
    playerId: string,
    action: Action,
  ) => {
    if (action.type === "play") {
      if (
        game.state.stack.length !== 0 &&
        game.state.stack[0].status !== "resolved"
      ) {
        throw new Error(
          "Cannot play an action since the last action is not yet resolved.",
        );
      }
      const move = action.action;
      if (move.type === "income") {
        game.state.stack.unshift({
          id: `${game.state.stack.length}`,
          action,
          playerId,
          status: "resolved",
        });
        game.state.players[playerId].money += 1;
        game.state.currentPlayer =
          (game.state.currentPlayer + 1) % game.state.playerOrder.length;
      } else if (move.type === "foreign-aid") {
        game.state.stack.unshift({
          id: `${game.state.stack.length}`,
          action,
          playerId,
          status: "played",
        });
      } else if (move.type === "coup") {
        game.state.stack.unshift({
          id: `${game.state.stack.length}`,
          action,
          playerId,
          status: "committed",
        });
        game.state.stack
    } else if (action.type === "react") {
      if (game.state.stack.length === 0) {
        throw new Error("Cannot react since no-one has played yet.");
      } else if (game.state.stack[0].status !== "played") {
        throw new Error(
          "Cannot react to the last action, since it has been committed.",
        );
      }
      const latestAction = game.state.stack[0];
      if (latestAction.action.type !== "play") {
        throw new Error("You can only block an action.");
      }
      if (latestAction.action.action.type === "foreign-aid") {
        if (action.card !== "duke") {
          throw new Error("You can only block foreign aid with a duke.");
        }
        game.state.stack.unshift({
          id: `${game.state.stack.length}`,
          action,
          playerId,
          status: "played",
        });
      } else if (latestAction.action.action.type === "assassinate") {
        if (action.card !== "contessa") {
          throw new Error(
            "You can only block an assassination with a contessa.",
          );
        }
        game.state.stack.unshift({
          id: `${game.state.stack.length}`,
          action,
          playerId,
          status: "played",
        });
      } else if (latestAction.action.action.type === "steal") {
        if (
          action.card !== "captain" &&
          action.card !== "ambassador" &&
          action.card !== "inquisitor"
        ) {
          throw new Error("You cannot block stealing with this card.");
        }
        game.state.stack.unshift({
          id: `${game.state.stack.length}`,
          action,
          playerId,
          status: "played",
        });
      } else {
        throw new Error("Can't block this action.");
      }
    }
  },
};
export default engine;
