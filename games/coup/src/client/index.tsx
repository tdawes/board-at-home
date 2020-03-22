/** @jsx jsx */
import { State, Action, Config, Card, Hand, HistoryEvent } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";
import { jsx, Label, Checkbox, Input, Flex, Box } from "theme-ui";
import pluralize from "pluralize";
import Actions from "./actions";
import { name } from "./utils";
import _ from "lodash";

export const defaultConfig: Config = {
  useExpansion: false,
  numberOfEachCard: 3,
};

export const ConfigPanel = ({ config, setConfig }: ConfigProps<Config>) => (
  <div>
    <Label>
      Use Reformation expansion:
      <Checkbox
        checked={config.useExpansion}
        onChange={e => setConfig({ useExpansion: e.target.checked })}
      />
    </Label>
    <Label>
      Number of each card:
      <Input
        type="number"
        min="3"
        max="5"
        value={config.numberOfEachCard}
        onChange={e =>
          setConfig({ numberOfEachCard: parseInt(e.target.value, 10) })
        }
      />
    </Label>
  </div>
);

const Treasury = ({ game }: { game: StartedGame<State, Config> }) => (
  <div>Treasury: {game.state.treasury} coins</div>
);

const Message = ({
  game,
  playerId,
}: {
  game: StartedGame<State, Config>;
  playerId: string;
}) => {
  if (game.state.finished) {
    if (game.state.winner == playerId) {
      return <div>You win!</div>;
    } else if (game.state.winner != null) {
      return <div>{name(game, game.state.winner)} wins!</div>;
    } else {
      return <div>Game over.</div>;
    }
  }
  if (game.state.playerOrder[game.state.currentPlayer] === playerId) {
    return <div>It's your turn.</div>;
  }
  return (
    <div>
      Waiting for {name(game, game.state.playerOrder[game.state.currentPlayer])}
      .
    </div>
  );
};

const SimpleCard = ({ card, dead }: { card?: Card; dead?: boolean }) => (
  <Box
    sx={{
      border: 1,
      borderColor: "black",
      borderStyle: "solid",
      p: 1,
      m: 1,
      ...(dead ? { bg: "black", color: "white" } : {}),
    }}
  >
    {card || "?"}
  </Box>
);

const OtherPlayers = ({
  game,
  playerId,
}: {
  game: StartedGame<State, Config>;
  playerId: string;
}) => (
  <Flex sx={{ width: "100%" }}>
    {Object.keys(game.players)
      .filter(other => other !== playerId)
      .map(other => (
        <Flex sx={{ flexGrow: 1, maxWidth: "200px", flexDirection: "column" }}>
          <Label>{name(game, other)}:</Label>
          <Flex>
            {game.state.players[other].deadCards.map((card: Card) => (
              <SimpleCard card={card} dead />
            ))}
            {game.state.players[other].liveCards.map(() => (
              <SimpleCard />
            ))}
          </Flex>
          <Flex>
            Money: {game.state.players[other].money}{" "}
            {pluralize("coin", game.state.players[other].money)}
          </Flex>
          <Flex>Team: {game.state.players[other].team}</Flex>
        </Flex>
      ))}
  </Flex>
);

const Hand = ({ hand }: { hand: Hand }) => (
  <div>
    <Label>Hand:</Label>
    <Flex>
      {hand.liveCards.map(card => (
        <SimpleCard card={card} />
      ))}
      {hand.deadCards.map(card => (
        <SimpleCard card={card} dead />
      ))}
    </Flex>
    <Box>
      Money: {hand.money} {pluralize("coin", hand.money)}
    </Box>
    <Box>Team: {hand.team}</Box>
  </div>
);

const logMessage = (game: StartedGame<State, Config>, event: HistoryEvent) => {
  if (event.action.type === "play") {
    const move = event.action.action;
    if (move.type === "assassinate") {
      return `${name(game, event.playerId)} assassinated ${name(
        game,
        move.target,
      )}.`;
    } else if (move.type === "convert") {
      if ("target" in move) {
        return `${name(game, event.playerId)} converted ${name(
          game,
          move.target,
        )}.`;
      } else {
        return `${name(game, event.playerId)} converted themselves.`;
      }
    } else if (move.type === "coup") {
      return `${name(game, event.playerId)} successfully couped ${name(
        game,
        move.target,
      )}.`;
    } else if (move.type === "embezzle") {
      return `${name(game, event.playerId)} embezzled from the treasury.`;
    } else if (move.type === "examine") {
      return `${name(game, event.playerId)} examined one of ${name(
        game,
        move.target,
      )}'s cards with an Inquisitor.`;
    } else if (move.type === "exchange-1") {
      return `${name(
        game,
        event.playerId,
      )} exchanged one of their cards with an Inquisitor.`;
    } else if (move.type === "exchange-2") {
      return `${name(
        game,
        event.playerId,
      )} exchanged two of their cards with an Ambassador.`;
    } else if (move.type === "foreign-aid") {
      return `${name(game, event.playerId)} received foreign aid.`;
    } else if (move.type === "income") {
      return `${name(game, event.playerId)} received income.`;
    } else if (move.type === "steal") {
      return `${name(game, event.playerId)} stole from ${name(
        game,
        move.target,
      )} with a Captain.`;
    } else if (move.type === "tax") {
      return `${name(game, event.playerId)} received tax with a Duke.`;
    }
  } else if (event.action.type === "react") {
    return `${name(game, event.action.playerId)} blocked with a ${_.capitalize(
      event.action.card,
    )}`;
  } else if (event.action.type === "challenge") {
    return `${name(game, event.action.playerId)} challenged.`;
  } else if (event.action.type === "discard") {
    return `${name(game, event.action.playerId)} discarded ${
      event.action.cards.length
    } ${pluralize("card", event.action.cards.length)}`;
  } else if (event.action.type === "force-replace") {
    return `${name(game, event.action.playerId)} made ${name(
      game,
      event.action.target,
    )} replace their card.`;
  } else if (event.action.type === "force-replace-cancel") {
    return `${name(game, event.action.playerId)} allowed ${name(
      game,
      event.action.target,
    )} to keep their card.`;
  } else if (event.action.type === "lose-influence") {
    return `${name(
      game,
      event.action.playerId,
    )} lost influence, and revealed a ${event.action.card}.`;
  } else if (event.action.type === "respond-to-challenge") {
    if (event.action.succeed) {
      if (event.action.condition.type === "must-have") {
        return `${name(game, event.action.playerId)} revealed a ${
          event.action.condition.card
        } and drew a new card.`;
      } else {
        return `${name(game, event.action.playerId)} revealed no ${
          event.action.condition.card
        }s and drew two new cards.`;
      }
    } else {
      return `${name(game, event.action.playerId)} conceded the challenge.`;
    }
  } else if (event.action.type === "reveal") {
    return `${name(game, event.action.playerId)} revealed a card to ${name(
      game,
      event.action.target,
    )}`;
  }
};

const Log = ({
  game,
  event,
}: {
  game: StartedGame<State, Config>;
  event: HistoryEvent;
}) => <Box>{logMessage(game, event)}</Box>;

export const Board = ({
  game,
  playerId,
  act,
}: BoardProps<State, Action, Config>) => (
  <Flex>
    <Flex className="board" sx={{ display: "flex", flexDirection: "column" }}>
      <Message playerId={playerId} game={game} />
      <Treasury game={game} />
      <OtherPlayers game={game} playerId={playerId} />
      <Hand hand={game.state.players[playerId]} />
      <Actions game={game} playerId={playerId} act={act} />
    </Flex>
    <Flex sx={{ flexDirection: "column" }}>
      {game.state.history.map(event => (
        <Log game={game} event={event} />
      ))}
    </Flex>
  </Flex>
);
