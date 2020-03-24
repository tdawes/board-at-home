import * as React from "react";
import { State, Action, Config, Card, Color } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";
import { Button, Flex, Box, Label, Input, IconButton } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faPlay,
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
    }
    return (
      <div>
        You lost... Score: {_.sum(Object.values(game.state.board.piles))}
      </div>
    );
  }
  const currentPlayer = Object.values(game.players)[game.state.currentPlayer];
  if (currentPlayer.id === playerId) {
    return <div>It's your turn.</div>;
  }
  return <div>Waiting for {currentPlayer.name || currentPlayer.id}.</div>;
};

// TODO: make these styles fit into the theme components
const CardDisplay = ({
  card,
  selected,
  onSelect,
}: {
  card: Card;
  selected: boolean;
  onSelect?: () => any;
}) => (
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
      border: selected ? "1px solid blue" : "1px solid white",
    }}
    onClick={onSelect}
  >
    {card.num}
  </div>
);

const ActionableCard = ({
  selected,
  canAct,
  onPlay,
  onDiscard,
  onSelect,
  onMoveLeft,
  onMoveRight,
}: {
  selected: boolean;
  canAct: boolean;
  onPlay: () => any;
  onDiscard: () => any;
  onSelect?: () => any;
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
        border: selected ? "1px solid blue" : "1px solid white",
      }}
      onClick={onSelect}
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
      <Button onClick={onPlay} sx={{ fontSize: "13px" }} mb={1}>
        <FontAwesomeIcon icon={faPlay} /> Play
      </Button>
    )}
    {canAct && (
      <Button onClick={onDiscard} sx={{ fontSize: "13px" }}>
        <FontAwesomeIcon icon={faTrash} /> Discard
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
  const canAct = !game.state.finished && game.state.currentPlayer == playerIdx;

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
              canAct={canAct}
              selected={game.state.selectedCards[playerIdx].includes(cardIdx)}
              onPlay={() => act({ type: "play", cardIdx })}
              onDiscard={() => act({ type: "discard", cardIdx })}
              onSelect={
                canAct
                  ? () => act({ type: "select", handIdx: playerIdx, cardIdx })
                  : undefined
              }
              onMoveLeft={
                cardIdx > 0
                  ? () =>
                      act({
                        type: "move",
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
          game.state.board.infoTokens > 0 && (
            <Button
              onClick={() => act({ type: "info" })}
              mb={4}
              sx={{ fontSize: "14px" }}
            >
              <FontAwesomeIcon icon={faInfoCircle} /> Give information
            </Button>
          )}
        {Object.keys(game.players).map((id, idx) =>
          id != playerId ? (
            <Flex sx={{ alignItems: "center" }} key={id}>
              {game.players[id].name || game.players[id].id}'s hand:{" "}
              {game.state.board.hands[idx].map((card, cardIdx) => (
                <CardDisplay
                  card={card}
                  key={cardIdx}
                  selected={game.state.selectedCards[idx].includes(cardIdx)}
                  onSelect={
                    canAct
                      ? () => act({ type: "select", handIdx: idx, cardIdx })
                      : undefined
                  }
                />
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
                selected={false}
              />
            ) : (
              <div style={{ height: CARD_HEIGHT }} key={color} />
            ),
          )}
        </Flex>
        {game.state.board.deck.length} cards left in the deck.
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
            <CardDisplay card={card} key={idx} selected={false} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
