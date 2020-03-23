import * as React from "react";
import { State, Action, Config, Card, Color } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";
import { Button, Flex, Box, Label, Input, IconButton } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faBomb,
  faTrash,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";

export const defaultConfig: Config = {
  gameType: "basic",
  infoTokens: 8,
  fuseTokens: 3,
};

export const ConfigPanel = ({ config, setConfig }: ConfigProps<Config>) => (
  <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
    <Label mb={1}>
      Game type: Basic (Sorry, 🌈rainbow🌈 is not supported yet)
    </Label>
    <Label sx={{ alignItems: "center", width: "180px" }}>
      <Input
        type="number"
        min="1"
        max="20"
        value={config.infoTokens}
        onChange={e => setConfig({ infoTokens: parseInt(e.target.value, 10) })}
        mb={1}
        mr={1}
        sx={{ width: "50px" }}
      />
      information tokens
    </Label>
    <Label sx={{ alignItems: "center", width: "180px" }}>
      <Input
        type="number"
        min="1"
        max="10"
        value={config.fuseTokens}
        onChange={e => setConfig({ fuseTokens: parseInt(e.target.value, 10) })}
        mb={1}
        mr={1}
        sx={{ width: "50px" }}
      />
      fuse tokens
    </Label>
  </Flex>
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
  onMoveLeft,
  onMoveRight,
}: {
  canAct: boolean;
  onPlay: () => any;
  onDiscard: () => any;
  onMoveLeft?: () => any;
  onMoveRight?: () => any;
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
    <Flex sx={{ justifyContent: "space-between" }}>
      {onMoveLeft ? (
        <IconButton onClick={onMoveLeft}>
          <FontAwesomeIcon icon={faArrowLeft} style={{ margin: "5px" }} />
        </IconButton>
      ) : (
        <div />
      )}
      {onMoveRight && (
        <IconButton onClick={onMoveRight}>
          <FontAwesomeIcon icon={faArrowRight} style={{ margin: "5px" }} />
        </IconButton>
      )}
    </Flex>
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
    {_.range(num).map(idx => (
      <FontAwesomeIcon
        key={`have_${idx}`}
        icon={icon}
        style={{ margin: "5px" }}
      />
    ))}
    {_.range(total - num).map(idx => (
      <FontAwesomeIcon
        icon={icon}
        key={`used_${idx}`}
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
              key={cardIdx}
              canAct={
                !game.state.finished && game.state.currentPlayer == playerIdx
              }
              onPlay={() => act({ type: "play", playerId, cardIdx })}
              onDiscard={() => act({ type: "discard", playerId, cardIdx })}
              onMoveLeft={
                cardIdx > 0
                  ? () =>
                      act({
                        type: "move",
                        playerId,
                        cardIdx,
                        direction: "left",
                      })
                  : undefined
              }
              onMoveRight={
                cardIdx < game.state.board.hands[playerIdx].length - 1
                  ? () =>
                      act({
                        type: "move",
                        playerId,
                        cardIdx,
                        direction: "right",
                      })
                  : undefined
              }
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
            <Flex sx={{ alignItems: "center" }} key={id}>
              {game.players[id].name || game.players[id].id}'s hand:{" "}
              {game.state.board.hands[idx].map((card, cardIdx) => (
                <CardDisplay card={card} key={cardIdx} />
              ))}
            </Flex>
          ) : (
            <div key={id} />
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
                key={color}
              />
            ) : (
              <div style={{ height: CARD_HEIGHT }} key={color} />
            ),
          )}
        </Flex>
        <Tokens
          num={game.state.board.infoTokens}
          total={game.config.infoTokens}
          icon={faInfoCircle}
        />
        <Tokens
          num={game.state.board.fuseTokens}
          total={game.config.fuseTokens}
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
          {game.state.board.discardPile.map((card, idx) => (
            <CardDisplay card={card} key={idx} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
