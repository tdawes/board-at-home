export { Board } from "./Board";
export { ConfigPanel } from "./ConfigPanel";
import { Config } from "../api";

export const defaultConfig: Config = {
  gameType: "basic",
  infoTokens: 8,
  fuseTokens: 3,
  royalFavour: false,
};
