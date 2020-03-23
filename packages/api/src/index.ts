export interface BaseGame {
  code: string;
  type: string;
  owner: string;
  players: { [id: string]: Player };
}

export type UnstartedGame = BaseGame & {
  started: false;
};
export type StartedGame<State, Config> = BaseGame & {
  started: true;
  config: Config;
  state: State;
};

export type Game<State, Config> = UnstartedGame | StartedGame<State, Config>;

export interface Player {
  id: string;
  name?: string;
}

export interface GameEngine<State, Action, Config> {
  isFull: (game: UnstartedGame) => boolean;
  start: (game: UnstartedGame, config: Config) => State;
  applyPlayerAction: (
    getGame: () => StartedGame<State, Config>,
    playerId: string,
    action: Action,
    triggerServerAction: (action: Action, playerId: string) => void,
  ) => State;
}

export interface ConfigProps<Config> {
  config: Config;
  setConfig: (config: Partial<Config>) => void;
}

export interface BoardProps<State, Action, Config> {
  game: StartedGame<State, Config>;
  playerId: string;
  act: (action: Action) => void;
}
