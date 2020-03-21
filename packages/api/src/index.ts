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

export interface GameEngine<S, A, C> {
  isFull: (game: UnstartedGame) => boolean;
  start: (game: UnstartedGame, config: C) => S;
  applyPlayerAction: (
    game: StartedGame<S, C>,
    playerId: string,
    action: A,
  ) => void;
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
