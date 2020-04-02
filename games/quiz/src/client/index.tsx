export { default as Board } from "./Board";
export { default as ConfigPanel } from "./ConfigPanel";
import { UnstartedGame } from "@board-at-home/api/src";
import { Config } from "../api";

export const defaultConfig = (game: UnstartedGame): Config => ({
  quizMaster: game.owner,
});
