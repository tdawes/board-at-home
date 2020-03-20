import * as MemoryCache from "memory-cache";
import {
  Game,
  UnstartedGame,
  StartedGame,
  Player,
  GameEngine,
} from "@board-at-home/api";
import ticTacToe from "@board-at-home/tic-tac-toe/dist/engine";
import coup from "@board-at-home/tic-tac-toe/dist/engine";

import { randomCode } from "./utils";

export interface GameController {
  newGame: (type: string, owner: string) => string;
  joinGame: (code: string, id: string) => void;
  kickPlayer: (code: string, id: string) => void;
  setPlayerName: (code: string, playerId: string, name: string) => void;
  startGame: (code: string, config: any) => void;
  listGames: () => Game<any>[];
  getGame: <S>(code: string) => Game<S>;
  applyPlayerAction: (code: string, playerId: string, action: any) => void;
}

const GAME_LIFESPAN = 1000 * 60 * 60; // 1 hour

const engines: { [key: string]: GameEngine<any, any, any> } = {
  ticTacToe,
  coup,
};

const getEngine = (type: string) => {
  if (!(type in engines)) {
    throw new Error(`No engine for type ${type}`);
  }
  return engines[type] as GameEngine<any, any, any>;
};

export default (): GameController => {
  const store = new MemoryCache.Cache<string, Game<any>>();

  const newCode = () => {
    while (true) {
      const code = randomCode(4);
      if (!store.get(code)) {
        return code;
      }
    }
  };

  const assertHasGame = (code: string) => {
    const game = store.get(code);
    if (game == null) {
      throw new Error("Game does not exist.");
    }
  };

  const assertHasPlayer = (game: Game<any>, playerId: string) => {
    const player = game.players[playerId];
    if (player == null) {
      throw new Error("Player is not in the game.");
    }
  };

  const assertGameNotStarted: (
    game: Game<any>,
  ) => asserts game is UnstartedGame = (game: Game<any>) => {
    if (game.started) {
      throw new Error("Game has already started.");
    }
  };

  const assertGameStarted: (
    game: Game<any>,
  ) => asserts game is StartedGame<any> = (game: Game<any>) => {
    if (!game.started) {
      throw new Error("Game has not started yet.");
    }
  };

  const getGame = <S>(code: string): Game<S> => {
    assertHasGame(code);
    return store.get(code) as Game<S>;
  };

  const getPlayer = (game: Game<any>, playerId: string): Player => {
    assertHasPlayer(game, playerId);
    return game.players[playerId];
  };

  const refresh = (game: Game<any>) =>
    store.put(game.code, game, GAME_LIFESPAN);

  const newGame = (type: string, owner: string) => {
    const code = newCode();
    store.put(
      code,
      {
        type,
        code,
        owner: owner,
        players: { [owner]: { id: owner } },
        started: false,
      },
      GAME_LIFESPAN,
    );
    return code;
  };

  const joinGame = (code: string, player: string) => {
    const game = getGame(code);

    const players = game.players;
    if (!(player in players)) {
      assertGameNotStarted(game);
      if (getEngine(game.type).isFull(game)) {
        throw new Error("Game is full.");
      }
      players[player] = { id: player };
    }
  };

  const kickPlayer = (code: string, player: string) => {
    const game = getGame(code);

    assertGameNotStarted(game);

    delete game.players[player];
  };

  const setPlayerName = (code: string, playerId: string, name: string) => {
    const game = getGame(code);

    assertGameNotStarted(game);

    const player = getPlayer(game, playerId);
    player.name = name;
  };

  const listGames = () =>
    store.keys().map(key => store.get(key)) as Game<any>[];

  const startGame = (code: string, config: any) => {
    const game = getGame(code);

    if (game.started) {
      throw new Error("Game has already started.");
    }

    getEngine(game.type).start(game, config);

    refresh(game);
  };

  const applyPlayerAction = (code: string, playerId: string, action: any) => {
    const game = getGame(code);

    assertHasPlayer(game, playerId);
    assertGameStarted(game);

    getEngine(game.type).applyPlayerAction(game, playerId, action);

    refresh(game);
  };

  return {
    newGame,
    joinGame,
    kickPlayer,
    setPlayerName,
    startGame,
    listGames,
    getGame,
    applyPlayerAction,
  };
};
