import { GameEngine, UnstartedGame, StartedGame } from "@board-at-home/api";
import { State, Action, Config, Board, Card } from "../api";
import * as _ from "lodash";

const checkForFinish = (_board: Board) => {
  // TODO Check if all piles completed
  // Check if too many mistakes have been made
  // Check if game is impossible to win? (Have this as config option?)
  return false;
};

const MAX_INFO_TOKENS = 8;
const MAX_FUSE_TOKENS = 3;

const engine: GameEngine<State, Action, Config> = {
  isFull: (game: UnstartedGame) => Object.keys(game.players).length >= 2, // 2-5
  start: (game: UnstartedGame, _config: Config) => {
    console.log(
      game.players,
      Object.keys(game.players),
      Object.keys(game.players).length,
    );
    if (Object.keys(game.players).length > 5) {
      throw new Error("Game is too full.");
    }
    if (Object.keys(game.players).length < 2) {
      throw new Error("Game is not full.");
    }
    ((game as any) as StartedGame<State>).started = true;
    // TODO: deal randomly
    // 4/5 players -> 4 cards each, otherwise 5
    const deck: Card[] = [];
    const hands: Card[][] = [];
    console.log("bbb");
    ((game as any) as StartedGame<State>).state = {
      board: {
        piles: { red: 0, green: 0, blue: 0, white: 0, yellow: 0 },
        discardPile: [],
        deck,
        hands,
      },
      finished: false,
      infoTokens: MAX_INFO_TOKENS,
      fuseTokens: MAX_FUSE_TOKENS,
      currentPlayer: 0,
    };
  },
  applyPlayerAction: (
    game: StartedGame<State>,
    _playerId: string,
    action: Action,
  ) => {
    if (action.type === "play") {
      // TODO play
    } else if (action.type === "discard") {
      // TODO discard
      if (game.state.infoTokens <= MAX_INFO_TOKENS) {
        game.state.infoTokens += 1;
      }
    } else if (action.type === "info") {
      // TODO clue
      if (game.state.infoTokens <= 0) {
        throw new Error("No information tokens left.");
      }
      game.state.infoTokens -= 1;
    }
    if (checkForFinish(game.state.board)) {
      game.state.finished = true;
    }
    game.state.currentPlayer =
      (game.state.currentPlayer + 1) % Object.keys(game.players).length;
  },
};
export default engine;
