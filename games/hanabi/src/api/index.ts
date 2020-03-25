export interface Config {
  gameType: "basic" | "rainbowIsItsOwnColor" | "rainbowIsAnyColor";
  infoTokens: number;
  fuseTokens: number;
  royalFavor: boolean;
}

// TODO: rainbow
export const colours = ["red", "blue", "green", "yellow", "white"] as const;
export type Colour = typeof colours[number];
export const numbers = [1, 2, 3, 4, 5] as const;
export type Number = typeof numbers[number];
export const maxCardNum = numbers[numbers.length - 1];

export interface Card {
  color: Colour;
  num: number;
}

export interface Board {
  deck: Card[];
  hands: Card[][];
  piles: { [key in Colour]: number };
  discardPile: { [key in Colour]: Card[] };
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

export const cardsPerNumber: { [key in Number]: number } = {
  1: 3,
  2: 2,
  3: 2,
  4: 2,
  5: 1,
};

export const minPlayers = 2;
export const maxPlayers = 5;
export const noSelectedCards = new Array(maxPlayers).fill([]);
export const getHandSize = (numPlayers: number) => (numPlayers >= 4 ? 4 : 5);

const mapToColours = <T>(defaultValue: T): { [key in Colour]: T } => {
  const piles: { [key: string]: T } = {};
  colours.map(colour => {
    piles[colour] = defaultValue;
  });
  return piles as { [key in Colour]: T };
};

export const emptyPiles: { [key in Colour]: number } = mapToColours(0);
export const emptyDiscardPile: { [key in Colour]: Card[] } = mapToColours([]);
