export interface BaseGame {
  code: string;
  type: string;
  owner: string;
  players: { [id: string]: Player };
}

export type UnstartedGame = BaseGame & {
  started: false;
};
export type StartedGame<State> = BaseGame & {
  started: true;
  state: State;
};

export type Game<State> = UnstartedGame | StartedGame<State>;

export interface Player {
  id: string;
  name?: string;
}

export interface GameEngine<S, A, C> {
  isFull: (game: UnstartedGame) => boolean;
  start: (game: UnstartedGame, config: C) => void;
  applyPlayerAction: (
    game: StartedGame<S>,
    playerId: string,
    action: A,
  ) => void;
}

export interface ConfigProps<Config> {
  config: Config;
  setConfig: (config: Partial<Config>) => void;
}

export interface BoardProps<State, Action> {
  game: StartedGame<State>;
  playerId: string;
  act: (action: Action) => void;
}
