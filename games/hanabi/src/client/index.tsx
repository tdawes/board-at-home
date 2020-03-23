import * as React from "react";
import { State, Action, Config, Card, Color } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";
import { Button, Flex } from "theme-ui";
import * as _ from "lodash";

export const defaultConfig: Config = {
  gameType: "basic",
};

export const ConfigPanel = (_props: ConfigProps<Config>) => (
  <div>
    <label>Game type:</label>
    Basic (Sorry, 🌈rainbow🌈 is not supported yet)
  </div>
);

const Message = ({
  game,
  playerId,
}: {
  game: StartedGame<State, Config>;
  playerId: string;
}) => {
  if (game.state.finished) {
    // TODO Calculate and display score
    if (_.every(Object.values(game.state.board.piles), num => num == 5)) {
      return <div>You won!</div>;
    } else if (game.state.board.fuseTokens <= 0) return <div>You lost...</div>;
  }
  if (Object.keys(game.players)[game.state.currentPlayer] === playerId) {
    return <div>It's your turn.</div>;
  }
  return <div>Waiting for other players.</div>;
};

// TODO: make these styles fit into the theme components
const CardDisplay = ({ card }: { card: Card }) => (
  <span
    style={{
      color: card.color,
      backgroundColor: "lightgrey",
      fontSize: "30px",
      margin: "5px",
      padding: "5px",
    }}
  >
    {card.num}
  </span>
);

const ActionableCard = ({
  canAct,
  onPlay,
  onDiscard,
}: {
  canAct: boolean;
  onPlay: () => any;
  onDiscard: () => any;
}) => (
  <Flex sx={{ flexDirection: "column" }} m={1}>
    <div
      style={{
        color: "darkgrey",
        backgroundColor: "lightgrey",
        fontSize: "30px",
        textAlign: "center",
      }}
    >
      ?
    </div>
    {canAct && <Button onClick={onPlay}>Play</Button>}
    {canAct && <Button onClick={onDiscard}>Discard</Button>}
  </Flex>
);

// TODO: pretty display with something resembling cards and tokens
export const Board = ({
  game,
  playerId,
  act,
}: BoardProps<State, Action, Config>) => (
  <div className="board" style={{ display: "flex", flexDirection: "column" }}>
    <Message playerId={playerId} game={game} />
    <div>Information tokens left: {game.state.board.infoTokens}</div>
    <div>Fuse tokens left: {game.state.board.fuseTokens}</div>
    <div>
      {Object.keys(game.players).map((id, idx) =>
        id != playerId ? (
          <div>
            {game.players[id].name || game.players[id].id}'s hand:{" "}
            {game.state.board.hands[idx].map(card => (
              <CardDisplay card={card} />
            ))}
          </div>
        ) : (
          <div>
            Your hand:
            <Flex>
              {game.state.board.hands[idx].map((_card, cardIdx) => (
                <ActionableCard
                  canAct={
                    !game.state.finished && game.state.currentPlayer == idx
                  }
                  onPlay={() => act({ type: "play", playerId, cardIdx })}
                  onDiscard={() => act({ type: "discard", playerId, cardIdx })}
                />
              ))}
            </Flex>
            {!game.state.finished &&
              game.state.currentPlayer === idx &&
              game.state.board.infoTokens >= 0 && (
                <Button onClick={() => act({ type: "info", playerId })}>
                  Give information
                </Button>
              )}
          </div>
        ),
      )}
    </div>
    <div>
      Discard pile:{" "}
      {game.state.board.discardPile.map(card => (
        <CardDisplay card={card} />
      ))}
    </div>
    <div>
      Piles on the table:{" "}
      {(Object.keys(game.state.board.piles) as Color[]).map((color: Color) => (
        <CardDisplay card={{ color, num: game.state.board.piles[color] }} />
      ))}
    </div>
  </div>
);
