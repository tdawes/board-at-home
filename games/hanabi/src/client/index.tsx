import * as React from "react";
import {
  State,
  Action,
  Config,
  Card,
  Color,
  MAX_INFO_TOKENS,
  MAX_FUSE_TOKENS,
} from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";
import { Button, Flex, Box } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faBomb,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";

export const defaultConfig: Config = {
  gameType: "basic",
};

export const ConfigPanel = (_props: ConfigProps<Config>) => (
  <div>
    <label>Game type:</label> Basic (Sorry, 🌈rainbow🌈 is not supported yet)
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
    if (_.every(Object.values(game.state.board.piles), num => num == 5)) {
      return <div>You won!</div>;
    } else if (game.state.board.fuseTokens <= 0)
      return (
        <div>
          You lost... Score: {_.sum(Object.values(game.state.board.piles))}
        </div>
      );
  }
  if (Object.keys(game.players)[game.state.currentPlayer] === playerId) {
    return <div>It's your turn.</div>;
  }
  return <div>Waiting for other players.</div>;
};

// TODO: make these styles fit into the theme components
const CardDisplay = ({ card }: { card: Card }) => (
  <div
    style={{
      color: card.color,
      backgroundColor: "lightgrey",
      fontSize: "30px",
      margin: "5px",
      padding: "12px 10px 10px",
      borderRadius: "4px",
      width: "35px",
      height: "50px",
      display: "inline",
      lineHeight: 1,
    }}
  >
    {card.num}
  </div>
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
  <Flex sx={{ flexDirection: "column" }} m={2}>
    <div
      style={{
        color: "darkgrey",
        backgroundColor: "lightgrey",
        fontSize: "30px",
        margin: "5px",
        padding: "15px 15px 10px",
        borderRadius: "4px",
        width: "45px",
        height: "55px",
        display: "table",
        alignSelf: "center",
      }}
    >
      ?
    </div>
    {canAct && (
      <Button onClick={onPlay} sx={{ fontSize: "14px" }} mb={1}>
        Play
      </Button>
    )}
    {canAct && (
      <Button onClick={onDiscard} sx={{ fontSize: "14px" }}>
        Discard
      </Button>
    )}
  </Flex>
);

const Tokens = ({
  num,
  total,
  icon,
}: {
  num: number;
  total: number;
  icon: any;
}) => (
  <Box m={1}>
    {_.range(num).map(_ => (
      <FontAwesomeIcon icon={icon} style={{ margin: "5px" }} />
    ))}
    {_.range(total - num).map(_ => (
      <FontAwesomeIcon
        icon={icon}
        style={{ margin: "5px" }}
        color="lightgrey"
      />
    ))}
  </Box>
);

const CARD_HEIGHT = "60px";

export const Board = ({
  game,
  playerId,
  act,
}: BoardProps<State, Action, Config>) => {
  const playerIdx = Object.keys(game.players).indexOf(playerId);

  return (
    <Flex className="board">
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Message playerId={playerId} game={game} />
        <Flex mb={3}>
          {game.state.board.hands[playerIdx].map((_card, cardIdx) => (
            <ActionableCard
              canAct={
                !game.state.finished && game.state.currentPlayer == playerIdx
              }
              onPlay={() => act({ type: "play", playerId, cardIdx })}
              onDiscard={() => act({ type: "discard", playerId, cardIdx })}
            />
          ))}
        </Flex>
        {!game.state.finished &&
          game.state.currentPlayer === playerIdx &&
          game.state.board.infoTokens >= 0 && (
            <Button onClick={() => act({ type: "info", playerId })} mb={4}>
              Give information
            </Button>
          )}
        {Object.keys(game.players).map((id, idx) =>
          id != playerId ? (
            <Flex sx={{ alignItems: "center" }}>
              {game.players[id].name || game.players[id].id}'s hand:{" "}
              {game.state.board.hands[idx].map(card => (
                <CardDisplay card={card} />
              ))}
            </Flex>
          ) : (
            <div />
          ),
        )}
      </Flex>
      <Flex
        sx={{
          flexDirection: "column",
          backgroundColor: "cornsilk",
          alignItems: "center",
          borderRadius: "4px",
          width: "300px",
        }}
      >
        <Flex sx={{ height: CARD_HEIGHT }}>
          {(Object.keys(
            game.state.board.piles,
          ) as Color[]).map((color: Color) =>
            game.state.board.piles[color] > 0 ? (
              <CardDisplay
                card={{ color, num: game.state.board.piles[color] }}
              />
            ) : (
              <div style={{ height: CARD_HEIGHT }} />
            ),
          )}
        </Flex>
        <Tokens
          num={game.state.board.infoTokens}
          total={MAX_INFO_TOKENS}
          icon={faInfoCircle}
        />
        <Tokens
          num={game.state.board.fuseTokens}
          total={MAX_FUSE_TOKENS}
          icon={faBomb}
        />
        <Flex
          sx={{
            minHeight: CARD_HEIGHT,
            alignItems: "center",
            flexWrap: "wrap",
          }}
          m={2}
        >
          {game.state.board.discardPile.length > 0 && (
            <FontAwesomeIcon icon={faTrash} />
          )}
          {game.state.board.discardPile.map(card => (
            <CardDisplay card={card} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
