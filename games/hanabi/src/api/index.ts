export type GameType = "basic" | "rainbow";

export interface Config {
  gameType: GameType;
  infoTokens: number;
  fuseTokens: number;
  royalFavour: boolean;
}

const colourValues = {
  white: "white",
  blue: "blue",
  green: "green",
  yellow: "yellow",
  red: "red",
  rainbow: "rainbow",
} as const;
const colours = Object.values(colourValues);
export type Colour = typeof colours[number];
export const getColours = (gameType: GameType): Colour[] =>
  gameType === "rainbow" ? colours : colours.filter(c => c !== "rainbow");

export const numbers = [1, 2, 3, 4, 5] as const;
export type Number = typeof numbers[number];
export const maxCardNum = numbers[numbers.length - 1];

export interface Card {
  colour: Colour;
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
export const noSelectedCards: number[][] = Array.from(
  { length: maxPlayers },
  _ => [],
);
export const getHandSize = (numPlayers: number) => (numPlayers >= 4 ? 4 : 5);

export const mapToColours = <T>(
  defaultValue: T,
  gameType: GameType,
): { [key in Colour]: T } => {
  const piles: { [key: string]: T } = {};
  const selectedColours = getColours(gameType) || colours;
  selectedColours.map(colour => {
    piles[colour] = defaultValue;
  });
  return piles as { [key in Colour]: T };
};

export const getEmptyPiles = (
  gameType: GameType,
): { [key in Colour]: number } => mapToColours(0, gameType);
export const getEmptyDiscardPile = (
  gameType: GameType,
): { [key in Colour]: Card[] } => mapToColours([], gameType);

export const hanabiColour = "#00897B";
export const colourMap = {
  red: "#E53935",
  blue: "#039BE5",
  green: "#66BB6A",
  yellow: "#FDD835",
};
