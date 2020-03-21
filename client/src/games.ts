import * as ticTacToe from "@board-at-home/tic-tac-toe/dist/client";
import * as coup from "@board-at-home/coup/dist/client";
import { BoardProps, ConfigProps } from "@board-at-home/api";

export interface GameFrontend<State, Action, Config> {
  ConfigPanel: React.ComponentType<ConfigProps<Config>>;
  Board: React.ComponentType<BoardProps<State, Action>>;
  defaultConfig: Config;
}

const games = {
  ticTacToe,
  coup,
} as {
  [key: string]: GameFrontend<any, any, any>;
};

export default games;
