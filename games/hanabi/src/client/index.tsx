import * as React from "react";
import { State, Action, Config, Card, Color } from "../api";
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

const CardDisplay = ({ card }: { card: Card }) => (
  <span
    style={{ color: card.color, backgroundColor: "grey", fontSize: "16px" }}
  >
    {card.num}
  </span>
);

export const Board = ({ game, playerId }: BoardProps<State, Action>) => {
  //const canPlay = game.players[game.state.currentPlayer].id === playerId;

  // TODO: pretty display with something resembling cards and tokens
  // TODO: hide your hand, and give others sensible names
  return (
    <div className="board" style={{ display: "flex", flexDirection: "column" }}>
      <Message playerId={playerId} game={game} />
      <div>Information tokens left: {game.state.infoTokens}</div>
      <div>Fuse tokens left: {game.state.fuseTokens}</div>
      <div>
        {Object.keys(game.state.board.hands).map(hand => (
          <div>
            Player {hand} hand:{" "}
            {game.state.board.hands[parseInt(hand)].map(card => (
              <CardDisplay card={card} />
            ))}
          </div>
        ))}
      </div>
      <div>
        Discard pile:{" "}
        {game.state.board.discardPile.map(card => (
          <CardDisplay card={card} />
        ))}
      </div>
      <div>
        Piles on the table:{" "}
        {(Object.keys(game.state.board.piles) as Color[]).map(
          (color: Color) => (
            <CardDisplay card={{ color, num: game.state.board.piles[color] }} />
          ),
        )}
      </div>
    </div>
  );
};
