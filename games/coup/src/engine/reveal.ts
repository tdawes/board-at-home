import { State, Card } from "../api";

export default (state: State, playerId: string, target: string, card: Card) => {
  if (
    !state.requiredUserInputs[playerId].some(
      event => event.type === "reveal-card" && event.target === target,
    )
  ) {
    throw new Error("Player does not have to reveal a card.");
  }
  if (!state.players[playerId].liveCards.includes(card)) {
    throw new Error("Player cannot reveal a card they do not have.");
  }
  state.requiredUserInputs[target].push({
    type: "decide-discard",
    target: playerId,
    card,
  });

  state.requiredUserInputs[playerId].splice(
    state.requiredUserInputs[playerId].findIndex(
      event => event.type === "reveal-card" && event.target === target,
    ),
    1,
  );
};
