import {
  ConfigPanel as TicTacToeConfigPanel,
  Board as TicTacToeBoard,
  defaultConfig as ticTacToeDefaultConfig,
} from "@board-at-home/tic-tac-toe/dist/client";
import { BoardProps, ConfigProps } from "@board-at-home/api";

export interface GameFrontend<State, Action, Config> {
  ConfigPanel: React.ComponentType<ConfigProps<Config>>;
  Board: React.ComponentType<BoardProps<State, Action, Config>>;
  defaultConfig: Config;
}

const games = {
  ticTacToe: {
    ConfigPanel: TicTacToeConfigPanel,
    Board: TicTacToeBoard,
    defaultConfig: ticTacToeDefaultConfig,
  },
} as {
  [key: string]: GameFrontend<any, any, any>;
};

export default games;
