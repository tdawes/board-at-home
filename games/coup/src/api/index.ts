export interface Config {
  useExpansion: boolean;
  numberOfEachCard: number;
}

export type Move =
  | {
      type:
        | "income"
        | "foreign-aid"
        | "tax"
        | "exchange-1"
        | "exchange-2"
        | "convert"
        | "embezzle";
    }
  | {
      type: "coup" | "assassinate" | "examine" | "steal" | "convert";
      target: string;
    };

export type Card =
  | "duke"
  | "assassin"
  | "ambassador"
  | "contessa"
  | "captain"
  | "inquisitor";

export type Team = "loyalist" | "reformist";

export type Hand = {
  liveCards: Card[];
  deadCards: Card[];
  money: number;
  team: Team;
};

export interface State {
  players: { [key: string]: Hand };
  deck: Card[];
  treasury: number;
  stack: {
    action: PlayAction | ReactAction | ChallengeAction;
    committed: boolean;
    resolved: boolean;
  }[];
}

export interface PlayAction {
  type: "play";
  playerId: string;
  action: Move;
}

export interface ReactAction {
  type: "react";
  playerId: string;
  card: Card;
}

export interface ChallengeAction {
  type: "challenge";
  playerId: string;
}

export interface RevealAction {
  type: "reveal";
  playerId: string;
  target: string;
  card: Card;
}

export interface DiscardAction {
  type: "discard";
  playerId: string;
  cards: Card[];
}

export type Action = PlayAction;
