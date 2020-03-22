import { StartedGame } from "@board-at-home/api/src";
import { State, Config } from "../api";

export const name = (game: StartedGame<State, Config>, playerId: string) =>
  game.players[playerId].name || playerId;
