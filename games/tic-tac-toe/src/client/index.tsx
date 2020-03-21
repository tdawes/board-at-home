import * as React from "react";
import { State, Action, Config } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";
import { Input, Flex, Box } from "theme-ui";

export const defaultConfig: Config = {
  size: 3,
};

export const ConfigPanel = ({ config, setConfig }: ConfigProps<Config>) => (
  <Flex sx={{ alignItems: "baseline" }}>
    <label>Board size:</label>
    <Input
      type="number"
      min="3"
      max="5"
      value={config.size}
      onChange={e => setConfig({ size: parseInt(e.target.value) })}
      sx={{ width: "80px" }}
      ml={2}
    />
  </Flex>
);

const Message = ({
  game,
  playerId,
}: {
  game: StartedGame<State>;
  playerId: string;
}) => {
  if (game.state.finished) {
    let text = "";
    if (game.state.winner == playerId) {
      text = "You win!";
    } else if (game.state.winner != null) {
      text = "You lose!";
    } else {
      text = "It's a draw!";
    }

    return (
      <Box sx={{ textAlign: "center" }} mb={1}>
        <b>{text}</b>
      </Box>
    );
  }
  if ((game.state.firstPlayer === playerId) === game.state.firstPlayersTurn) {
    return (
      <Box sx={{ textAlign: "center" }} mb={1}>
        It's <b>your turn</b>! You are{" "}
        {playerId === game.state.firstPlayer ? "X" : "O"}.
      </Box>
    );
  }
  return (
    <Box sx={{ textAlign: "center" }} mb={1}>
      <i>Waiting for opponent.</i>
    </Box>
  );
};

export const Board = ({ game, playerId, act }: BoardProps<State, Action>) => {
  const canPlay =
    (game.state.firstPlayer === playerId) === game.state.firstPlayersTurn;

  return (
    <Flex className="board" style={{ flexDirection: "column" }} mt={3}>
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
                fontSize: "80px",
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
    </Flex>
  );
};
