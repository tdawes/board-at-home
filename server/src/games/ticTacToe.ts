import { GameEngine, UnstartedGame, StartedGame } from "../types";
interface TicTacToeState {
  board: (boolean | null)[][];
  finished: boolean;
  winner?: string;
}
type TicTacToeAction = { type: "play"; x: number; y: number };

const engine: GameEngine<TicTacToeState, TicTacToeAction> = {
  isFull: (game: UnstartedGame) => Object.keys(game.players).length >= 2,
  start: (game: UnstartedGame) => {
    if (Object.keys(game.players).length >= 2) {
      throw new Error("Game is too full.");
    }
    (game as any).started = true;
    (game as any).state = {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      finished: false,
    };
  },
  applyPlayerAction: (
    game: StartedGame<TicTacToeState>,
    _playerId: string,
    action: TicTacToeAction,
  ) => {
    if (game.state.board[action.x][action.y] !== null) {
      throw new Error("Invalid move.");
    }
    game.state.board[action.x][action.y] = true;
  },
};

export default engine;
