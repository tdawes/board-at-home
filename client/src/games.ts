import {
  ConfigPanel as TicTacToeConfigPanel,
  Board as TicTacToeBoard,
  defaultConfig as ticTacToeDefaultConfig,
} from "@board-at-home/tic-tac-toe/dist/client";
import {
  ConfigPanel as HanabiConfigPanel,
  Board as HanabiBoard,
  defaultConfig as HanabiDefaultConfig,
} from "@board-at-home/hanabi/dist/client";
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
  hanabi: {
    ConfigPanel: HanabiConfigPanel,
    Board: HanabiBoard,
    defaultConfig: HanabiDefaultConfig,
  },
} as {
  [key: string]: GameFrontend<any, any, any>;
};

export default games;
