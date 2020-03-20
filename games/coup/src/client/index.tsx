import * as React from "react";
import { State, Action, Config } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";

export const defaultConfig: Config = {
  size: 3,
};

export const ConfigPanel = ({ config, setConfig }: ConfigProps<Config>) => (
  <div>
    <label>Board size:</label>
    <input
      type="number"
      min="3"
      max="5"
      value={config.size}
      onChange={e => setConfig({ size: parseInt(e.target.value) })}
    />
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
    if (game.state.winner == playerId) {
      return <div>You win!</div>;
    } else if (game.state.winner != null) {
      return <div>You lose!</div>;
    } else {
      return <div>It's a draw!</div>;
    }
  }
  if ((game.state.firstPlayer === playerId) === game.state.firstPlayersTurn) {
    return (
      <div>
        It's your turn. You are{" "}
        {playerId === game.state.firstPlayer ? "X" : "O"}
      </div>
    );
  }
  return <div>Waiting for opponent.</div>;
};

export const Board = ({ game, playerId, act }: BoardProps<State, Action>) => {
  const canPlay =
    (game.state.firstPlayer === playerId) === game.state.firstPlayersTurn;

  return (
    <div className="board" style={{ display: "flex", flexDirection: "column" }}>
      <Message playerId={playerId} game={game} />
      {game.state.board.map((row, x) => (
        <div
          className="row"
          style={{ display: "flex", flexDirection: "row" }}
          key={x}
        >
          {row.map((cell, y) => (
            <div
              className="cell"
              style={{
                width: "100px",
                height: "100px",
                display: "block",
                verticalAlign: "middle",
                textAlign: "center",
                border: "1px solid black",
              }}
              key={y}
              onClick={() => {
                if (!game.state.finished && cell === null && canPlay) {
                  act({ type: "play", playerId, x, y });
                }
              }}
            >
              {cell === true ? "X" : cell === false ? "O" : ""}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
