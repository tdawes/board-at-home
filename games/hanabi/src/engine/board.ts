import {
  Board,
  maxCardNum,
  Card,
  emptyPiles,
  emptyDiscardPile,
  Config,
} from "../api";
import { cannotCompleteEverySet, createDeck, deal } from "./deck";
import * as _ from "lodash";

export const getInitialBoard = (numPlayers: number, config: Config): Board => {
  const deck: Card[] = createDeck();
  return {
    piles: emptyPiles,
    discardPile: emptyDiscardPile,
    deck,
    hands: deal(deck, numPlayers),
    infoTokens: config.infoTokens,
    fuseTokens: config.fuseTokens,
  };
};

// Completing all sets to 5 immediately wins the game.
// You always lose if you run out of fuse tokens.
// Otherwise play continues until the deck becomes empty, and for one full round after that.
// The Royal Favor variant doesn't use scoring and players keep on playing even after the deck is gone, having potentially fewer cards in hands.
// Completing all fireworks till 5 is a win, anything else is a loss for all players.
// The game ends immediately when a player would start a turn with no cards in hand.
export const isFinished = (
  board: Board,
  currentPlayer: number,
  royalFavor: boolean,
  finalPlayer?: number,
) => {
  const won = _.every(Object.values(board.piles), num => num === maxCardNum);
  const lostNormalGame = () =>
    board.deck.length === 0 && currentPlayer === finalPlayer;
  const lostRoyalFavor = () =>
    board.hands[currentPlayer].length === 0 ||
    cannotCompleteEverySet(board.discardPile);
  const lost =
    board.fuseTokens <= 0 || (royalFavor ? lostRoyalFavor() : lostNormalGame());
  return won || lost;
};
