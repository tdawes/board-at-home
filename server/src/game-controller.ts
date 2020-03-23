import * as MemoryCache from "memory-cache";
import {
  Game,
  UnstartedGame,
  StartedGame,
  Player,
  GameEngine,
} from "@board-at-home/api";
import ticTacToe from "@board-at-home/tic-tac-toe/dist/engine";
import coup from "@board-at-home/coup/dist/engine";

import { randomCode } from "./utils";
import produce from "immer";

export interface GameController {
  newGame: (type: string, owner: string) => string;
  joinGame: (code: string, id: string) => void;
  kickPlayer: (code: string, id: string) => void;
  setPlayerName: (code: string, playerId: string, name: string) => void;
  startGame: (code: string, config: any) => void;
  listGames: () => Game<any, any>[];
  getGame: <S, C>(code: string) => Game<S, C>;
  applyPlayerAction: (
    code: string,
    playerId: string,
    action: any,
    applyServerAction: (action: any, playerId: string) => void,
  ) => void;
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
  const store = new MemoryCache.Cache<string, Game<any, any>>();

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

  const assertHasPlayer = (game: Game<any, any>, playerId: string) => {
    const player = game.players[playerId];
    if (player == null) {
      throw new Error("Player is not in the game.");
    }
  };

  const assertGameNotStarted: (
    game: Game<any, any>,
  ) => asserts game is UnstartedGame = (game: Game<any, any>) => {
    if (game.started) {
      throw new Error("Game has already started.");
    }
  };

  const assertGameStarted: (
    game: Game<any, any>,
  ) => asserts game is StartedGame<any, any> = (game: Game<any, any>) => {
    if (!game.started) {
      throw new Error("Game has not started yet.");
    }
  };

  const getGame = <S, C>(code: string): Game<S, C> => {
    assertHasGame(code);
    return store.get(code) as Game<S, C>;
  };

  const getPlayer = (game: Game<any, any>, playerId: string): Player => {
    assertHasPlayer(game, playerId);
    return game.players[playerId];
  };

  const updateGame: {
    <S, C>(
      game: UnstartedGame,
      updateFunction?: (game: UnstartedGame) => Game<S, C> | void,
    ): void;
    <S, C>(
      game: StartedGame<S, C>,
      updateFunction?: (game: StartedGame<S, C>) => Game<S, C> | void,
    ): void;
    <S, C>(
      game: Game<S, C>,
      updateFunction?: (game: Game<S, C>) => Game<S, C> | void,
    ): void;
  } = (<S, C>(
    game: Game<S, C>,
    updateFunction?: (game: Game<S, C>) => Game<S, C> | void,
  ) =>
    store.put(
      game.code,
      updateFunction ? produce(game, updateFunction) : game,
      GAME_LIFESPAN,
    )) as any;

  const newGame = (type: string, owner: string) => {
    const code = newCode();
    updateGame({
      type,
      code,
      owner: owner,
      players: { [owner]: { id: owner } },
      started: false,
    });
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
      updateGame(game, g => {
        g.players[player] = { id: player };
      });
    }
  };

  const kickPlayer = (code: string, player: string) => {
    const game = getGame(code);

    assertGameNotStarted(game);

    updateGame(game, g => {
      delete g.players[player];
    });
  };

  const setPlayerName = (code: string, playerId: string, name: string) => {
    const game = getGame(code);

    updateGame(game, game => {
      const player = getPlayer(game, playerId);
      player.name = name;
    });
  };

  const listGames = () =>
    store.keys().map(key => store.get(key)) as Game<any, any>[];

  const startGame = (code: string, config: any) => {
    const game = getGame(code);

    if (game.started) {
      throw new Error("Game has already started.");
    }

    updateGame(game, game => {
      return {
        ...game,
        started: true,
        config,
        state: getEngine(game.type).start(game as UnstartedGame, config),
      };
    });
  };

  const applyPlayerAction = (
    code: string,
    playerId: string,
    action: any,
    applyServerAction: (action: any, playerId: string) => void,
  ) => {
    const game = getGame(code);

    assertHasPlayer(game, playerId);
    assertGameStarted(game);

    updateGame(game, (game: StartedGame<any, any>) => {
      game.state = getEngine(game.type).applyPlayerAction(
        () => {
          const game = getGame(code);
          assertHasPlayer(game, playerId);
          assertGameStarted(game);
          return game as StartedGame<any, any>;
        },
        playerId,
        action,
        applyServerAction,
      );
    });
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
