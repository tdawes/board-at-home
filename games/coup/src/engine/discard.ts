import { State, Card } from "../api";
import _ from "lodash";

export default (state: State, playerId: string, cards: Card[]) => {
  const playerHand = state.players[playerId];

  if (
    !state.requiredUserInputs[playerId].some(
      event => event.type === "discard-card" && event.amount === cards.length,
    )
  ) {
    throw new Error("Player does not have to discard cards.");
  }

  cards.forEach(card => {
    if (!playerHand.liveCards.includes(card)) {
      throw new Error("Player is trying to discard a card they do not have.");
    }
    state.deck.push(
      ...playerHand.liveCards.splice(playerHand.liveCards.indexOf(card), 1),
    );
    state.deck = _.shuffle(state.deck);
  });

  state.requiredUserInputs[playerId].splice(
    state.requiredUserInputs[playerId].findIndex(
      event => event.type === "discard-card" && event.amount === cards.length,
    ),
    1,
  );
};
