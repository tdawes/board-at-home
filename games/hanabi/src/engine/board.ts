import * as _ from "lodash";
import {
  Board,
  Card,
  Config,
  getEmptyDiscardPile,
  getEmptyPiles,
  maxCardNum,
} from "../api";
import { cannotCompleteEverySet, createDeck, deal } from "./deck";

export const getInitialBoard = (numPlayers: number, config: Config): Board => {
  const deck: Card[] = createDeck(config.gameType);
  return {
    piles: getEmptyPiles(config.gameType),
    discardPile: getEmptyDiscardPile(config.gameType),
    deck,
    hands: deal(deck, numPlayers),
    infoTokens: config.infoTokens,
    fuseTokens: config.fuseTokens,
  };
};

// Completing all sets to 5 immediately wins the game.
// You always lose if you run out of fuse tokens.
// Otherwise play continues until the deck becomes empty, and for one full round after that.
// The Royal Favour variant doesn't use scoring and players keep on playing even after the deck is gone, having potentially fewer cards in hands.
// Completing all fireworks till 5 is a win, anything else is a loss for all players.
// The game ends immediately when a player would start a turn with no cards in hand.
export const isFinished = (
  board: Board,
  currentPlayer: number,
  royalFavour: boolean,
  finalPlayer?: number,
) => {
  const won = _.every(Object.values(board.piles), num => num === maxCardNum);
  const lostNormalGame = () =>
    board.deck.length === 0 && currentPlayer === finalPlayer;
  const lostRoyalFavour = () =>
    board.hands[currentPlayer].length === 0 ||
    cannotCompleteEverySet(board.discardPile);
  const lost =
    board.fuseTokens <= 0 ||
    (royalFavour ? lostRoyalFavour() : lostNormalGame());
  return won || lost;
};
