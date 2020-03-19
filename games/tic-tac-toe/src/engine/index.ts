import { GameEngine, UnstartedGame, StartedGame } from "@board-at-home/api";
import { State, Action, Config, Board } from "../api";
import * as _ from "lodash";

const checkForWin = (board: Board) =>
  [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ].some(
    ([a, b, c]) =>
      board[a[0]][a[1]] != null &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]],
  );

const checkForDraw = (board: Board) => {
  return board.every(row => row.every(cell => cell != null));
};

const engine: GameEngine<State, Action, Config> = {
  isFull: (game: UnstartedGame) => Object.keys(game.players).length >= 2,
  start: (game: UnstartedGame, config: Config) => {
    console.log(
      game.players,
      Object.keys(game.players),
      Object.keys(game.players).length,
    );
    if (Object.keys(game.players).length > 2) {
      throw new Error("Game is too full.");
    }
    if (Object.keys(game.players).length < 2) {
      throw new Error("Game is not full.");
    }
    ((game as any) as StartedGame<State>).started = true;
    ((game as any) as StartedGame<State>).state = {
      board: _.range(config.size).map(() =>
        _.range(config.size).map(() => null),
      ),
      finished: false,
      firstPlayer: Object.keys(game.players)[
        Math.floor((Math.random() * 2) % 2)
      ],
      firstPlayersTurn: true,
    };
  },
  applyPlayerAction: (
    game: StartedGame<State>,
    playerId: string,
    action: Action,
  ) => {
    if (action.type === "play") {
      if (game.state.board[action.x][action.y] !== null) {
        throw new Error("Invalid move.");
      }
      game.state.board[action.x][action.y] =
        playerId === game.state.firstPlayer;
    }
    if (checkForWin(game.state.board)) {
      game.state.finished = true;
      game.state.winner = playerId;
    } else if (checkForDraw(game.state.board)) {
      game.state.finished = true;
    } else {
      game.state.firstPlayersTurn = !game.state.firstPlayersTurn;
    }
  },
};
export default engine;
