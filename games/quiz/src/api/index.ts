export type GameType = "basic" | "rainbow";

export interface Config {
  quizMaster: string;
}

export interface State {
  playerOrder: string[];
  locked: boolean;
  answers: { [key: string]: string };
}

export interface SubmitAnswerAction {
  type: "submit";
  answer: string;
}

export interface LockInAnswersAction {
  type: "lock-in";
}

export interface ClearAnswersAction {
  type: "clear";
}

export type Action =
  | SubmitAnswerAction
  | LockInAnswersAction
  | ClearAnswersAction;
