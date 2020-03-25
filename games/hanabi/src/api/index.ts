export interface Config {
  gameType: "basic" | "rainbowIsItsOwnColor" | "rainbowIsAnyColor";
  infoTokens: number;
  fuseTokens: number;
  royalFavor: boolean;
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
  discardPile: { [key in Color]: Card[] };
  fuseTokens: number;
  infoTokens: number;
}

export interface State {
  board: Board;
  currentPlayer: number;
  finalPlayer?: number;
  finished: boolean;
  selectedCards: number[][];
}

export interface PlayAction {
  type: "play";
  cardIdx: number;
}

export interface DiscardAction {
  type: "discard";
  cardIdx: number;
}

export interface InfoAction {
  type: "info";
}

export interface MoveAction {
  type: "move";
  cardIdx: number;
  direction: "left" | "right";
}

export interface SelectAction {
  type: "select";
  cardIdx: number;
  handIdx: number;
}

export type Action =
  | PlayAction
  | DiscardAction
  | InfoAction
  | MoveAction
  | SelectAction;
