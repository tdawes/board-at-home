export interface Config {
  gameType: "basic" | "rainbowIsItsOwnColor" | "rainbowIsAnyColor";
}

// TODO: rainbow
export type Color = "red" | "blue" | "green" | "yellow" | "white";

export interface Card {
  color: Color;
  num: number;
}

export interface Board {
  deck: Card[];
  hands: Card[][];
  piles: { [key in Color]: number };
  discardPile: Card[];
  fuseTokens: number;
  infoTokens: number;
}

export interface State {
  board: Board;
  currentPlayer: number;
  finished: boolean;
}

export interface PlayAction {
  type: "play";
  playerId: string;
  cardIdx: number;
}

export interface DiscardAction {
  type: "discard";
  playerId: string;
  cardIdx: number;
}

export interface InfoAction {
  type: "info";
  playerId: string;
}

export type Action = PlayAction | DiscardAction | InfoAction;

export const MAX_INFO_TOKENS = 8;
export const MAX_FUSE_TOKENS = 3;
