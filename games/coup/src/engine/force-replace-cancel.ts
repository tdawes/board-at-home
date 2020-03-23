import { State, Card } from "../api";

export default (state: State, playerId: string, target: string, card: Card) => {
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
