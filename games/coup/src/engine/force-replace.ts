import { State, Card } from "../api";
import _ from "lodash";

export default (state: State, playerId: string, target: string, card: Card) => {
  const targetHand = state.players[target];

  if (
    !state.requiredUserInputs[playerId].some(
      event =>
        event.type === "decide-discard" &&
        event.target === target &&
        event.card === card,
    )
  ) {
    throw new Error("Not an available action.");
  }
  if (!targetHand.liveCards.includes(card)) {
    throw new Error(
      "Cannot force the player to replace this card, as they do not have it.",
    );
  }

  targetHand.liveCards.splice(targetHand.liveCards.indexOf(card), 1);
  targetHand.liveCards.push(state.deck.pop()!);
  state.deck.push(card);
  state.deck = _.shuffle(state.deck);

  state.requiredUserInputs[playerId].splice(
    state.requiredUserInputs[playerId].findIndex(
      event =>
        event.type === "decide-discard" &&
        event.target === target &&
        event.card === card,
    ),
    1,
  );
};
