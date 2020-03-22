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

export interface Hand {
  liveCards: Card[];
  deadCards: Card[];
  money: number;
  team: Team;
}

export interface HistoryEvent {
  playerId: string;
  action: Action;
}

export interface DiscardCardUserInput {
  type: "discard-card";
  amount: number;
}
export interface RespondToChallengeUserInput {
  type: "respond-to-challenge";
  condition: ChallengeCondition;
}
export interface LoseInfluenceUserInput {
  type: "lose-influence";
}
export interface RevealCardUserInput {
  type: "reveal-card";
  target: string;
}
export interface DecideDiscardUserInput {
  type: "decide-discard";
  target: string;
  card: Card;
}
export type UserInput =
  | DiscardCardUserInput
  | RespondToChallengeUserInput
  | LoseInfluenceUserInput
  | RevealCardUserInput
  | DecideDiscardUserInput;

export interface State {
  players: { [key: string]: Hand };
  deck: Card[];
  treasury: number;
  history: HistoryEvent[];
  currentAction?: {
    id: string;
    playerId: string;
    action: PlayAction;
    accepted: { [playerId: string]: boolean };
  };
  currentReaction?: {
    id: string;
    playerId: string;
    action: ReactAction;
    accepted: { [playerId: string]: boolean };
  };
  currentChallenge?: {
    playerId: string;
  };
  requiredUserInputs: {
    [player: string]: UserInput[];
  };
  playerOrder: string[];
  currentPlayer: number;
  finished: boolean;
  winner?: string;
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

export interface ChallengeCondition {
  type: "must-have" | "must-not-have";
  card: Card;
}

export interface ChallengeAction {
  type: "challenge";
  playerId: string;
  id: string;
  condition: ChallengeCondition;
}

export interface AcceptAction {
  type: "accept";
  id: string;
  playerId: string;
}

export interface RespondToChallengeAction {
  type: "respond-to-challenge";
  playerId: string;
  challenger: string;
  succeed: boolean;
  condition: ChallengeCondition;
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

export interface ForceReplaceAction {
  type: "force-replace";
  playerId: string;
  target: string;
  card: Card;
}

export interface ForceReplaceCancelAction {
  type: "force-replace-cancel";
  playerId: string;
  target: string;
  card: Card;
}

export interface LoseInfluenceAction {
  type: "lose-influence";
  playerId: string;
  card: Card;
}

export interface CommitAction {
  type: "commit";
}

export type Action =
  | PlayAction
  | ReactAction
  | ChallengeAction
  | AcceptAction
  | RespondToChallengeAction
  | RevealAction
  | DiscardAction
  | ForceReplaceAction
  | ForceReplaceCancelAction
  | LoseInfluenceAction
  | CommitAction;
