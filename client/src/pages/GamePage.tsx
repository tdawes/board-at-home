import * as React from "react";
import io from "socket.io-client";
import { dispatch, watch, state } from "../model";
import { registerSocket, joinGame } from "../actions";

export interface Props {
  code: string;
}

export default ({ code }: Props) => {
  React.useEffect(() => {
    const socket = io.connect();
    dispatch(registerSocket)(socket, dispatch);
    dispatch(joinGame)(code);

    return () => {
      socket.disconnect();
    };
  }, [code]);

  const gameState = watch(state.gameState);

  if (gameState == null) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p>Welcome to game {code}.</p>
      <p>
        Players:
        <ul>
          {Object.keys(gameState.players).map(playerId => (
            <li key={playerId}>
              {gameState.players[playerId].name || playerId}
            </li>
          ))}
        </ul>
      </p>
    </div>
  );
};
