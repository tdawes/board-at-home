import { BoardProps, ConfigProps } from "@board-at-home/api";
import * as coup from "@board-at-home/coup/dist/client";
import * as hanabi from "@board-at-home/hanabi/dist/client";
import * as quiz from "@board-at-home/quiz/dist/client";
import * as ticTacToe from "@board-at-home/tic-tac-toe/dist/client";

export interface GameFrontend<State, Action, Config> {
  ConfigPanel: React.ComponentType<ConfigProps<Config>>;
  Board: React.ComponentType<BoardProps<State, Action, Config>>;
  defaultConfig: Config;
}

const games = {
  ticTacToe,
  coup,
  hanabi,
  quiz,
} as {
  [key: string]: GameFrontend<any, any, any>;
};

export default games;
