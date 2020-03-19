export interface Config {
  size: number;
}

export type Board = (boolean | null)[][];

export interface State {
  board: Board;
  firstPlayer: string;
  firstPlayersTurn: boolean;
  finished: boolean;
  winner?: string;
}

export interface PlayAction {
  type: "play";
  playerId: string;
  x: number;
  y: number;
}

export type Action = PlayAction;
