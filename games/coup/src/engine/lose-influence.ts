import { State, Card } from "../api";

export default (state: State, playerId: string, card: Card) => {
  const playerHand = state.players[playerId];
  if (
    !state.requiredUserInputs[playerId].some(
      event => event.type === "lose-influence",
    )
  ) {
    throw new Error("Player doesn't need to lose influence.");
  }
  if (!playerHand.liveCards.includes(card)) {
    throw new Error("Cannot lose influence, as do not have that card");
  }
  playerHand.liveCards.splice(playerHand.liveCards.indexOf(card), 1);
  playerHand.deadCards.push(card);

  state.requiredUserInputs[playerId].splice(
    state.requiredUserInputs[playerId].findIndex(
      event => event.type === "lose-influence",
    ),
    1,
  );
};
