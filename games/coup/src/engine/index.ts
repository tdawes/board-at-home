import { GameEngine, UnstartedGame, StartedGame } from "@board-at-home/api";
import { State, Action, Config, Board } from "../api";
import * as _ from "lodash";

const checkForWin = (board: Board) => {
  // Rows
  for (let i = 0; i < board.length; i++) {
    const first = board[i][0];
    if (first != null) {
      if (_.range(1, board[i].length).every(j => first === board[i][j])) {
        return true;
      }
    }
  }
  // Columns
  for (let j = 0; j < board[0].length; j++) {
    const first = board[0][j];
    if (first != null) {
      if (_.range(1, board.length).every(i => first === board[i][j])) {
        return true;
      }
    }
  }

  // Diagonals
  const topLeft = board[0][0];
  if (topLeft != null) {
    if (_.range(1, board.length).every(i => topLeft === board[i][i])) {
      return true;
    }
  }
  const topRight = board[0][board[0].length - 1];
  if (topRight != null) {
    if (
      _.range(1, board.length).every(
        i => topRight === board[i][board.length - 1 - i],
      )
    ) {
      return true;
    }
  }
  return false;
};

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
