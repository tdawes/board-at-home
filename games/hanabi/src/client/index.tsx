import * as React from "react";
import { State, Action, Config } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";

export const defaultConfig: Config = {
  gameType: "basic",
};

export const ConfigPanel = (_props: ConfigProps<Config>) => (
  <div>
    <label>Game type:</label>
    Basic (Sorry, 🌈rainbow is not supported yet)
  </div>
);

const Message = ({
  game,
  playerId,
}: {
  game: StartedGame<State>;
  playerId: string;
}) => {
  if (game.state.finished) {
    // TODO Display whether we won or lost
    // Calculate and display score
  }
  if (Object.keys(game.players)[game.state.currentPlayer] === playerId) {
    return <div>It's your turn.</div>;
  }
  return <div>Waiting for other players.</div>;
};

export const Board = ({ game, playerId }: BoardProps<State, Action>) => {
  //const canPlay = game.players[game.state.currentPlayer].id === playerId;
  console.log("test", playerId, game);

  return (
    <div className="board" style={{ display: "flex", flexDirection: "column" }}>
      <Message playerId={playerId} game={game} />
      TODO
    </div>
  );
};
