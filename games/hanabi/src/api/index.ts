export interface Config {
  gameType: "basic" | "rainbowIsItsOwnColor" | "rainbowIsAnyColor";
  infoTokens: number;
  fuseTokens: number;
}
// TODO: The Royal Favor variant doesn't use scoring and players keep on playing even after the deck is gone, having potentially fewer cards in hands. Completing all fireworks till 5 is a win, anything else is a loss for all players. The game ends immediately when a player would start a turn with no cards in hand.

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
