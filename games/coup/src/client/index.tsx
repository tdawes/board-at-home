/** @jsx jsx */
import { State, Action, Config, Card, Hand } from "../api";
import { ConfigProps, BoardProps, StartedGame } from "@board-at-home/api";
import { jsx, Label, Checkbox, Input, Flex, Box } from "theme-ui";
import pluralize from "pluralize";
import Actions from "./actions";

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

const Treasury = ({ game }: { game: StartedGame<State> }) => (
  <div>Treasury: {game.state.treasury} coins</div>
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
      return (
        <div>
          {game.players[game.state.winner].name || game.state.winner} wins!
        </div>
      );
    } else {
      return <div>Game over.</div>;
    }
  }
  if (game.state.playerOrder[game.state.currentPlayer] === playerId) {
    return <div>It's your turn.</div>;
  }
  return (
    <div>
      Waiting for{" "}
      {game.players[game.state.playerOrder[game.state.currentPlayer]].name ||
        game.state.playerOrder[game.state.currentPlayer]}
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
  game: StartedGame<State>;
  playerId: string;
}) => (
  <Flex sx={{ width: "100%" }}>
    {Object.keys(game.players)
      .filter(other => other !== playerId)
      .map(other => (
        <Flex sx={{ flexGrow: 1, maxWidth: "200px", flexDirection: "column" }}>
          <Label>{game.players[other].name || other}:</Label>
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
    <Box>Money: {hand.money} coins</Box>
    <Box>Team: {hand.team}</Box>
  </div>
);

export const Board = ({ game, playerId, act }: BoardProps<State, Action>) => {
  console.log(game);
  return (
    <div className="board" style={{ display: "flex", flexDirection: "column" }}>
      <Message playerId={playerId} game={game} />
      <Treasury game={game} />
      <OtherPlayers game={game} playerId={playerId} />
      <Hand hand={game.state.players[playerId]} />
      <Actions game={game} playerId={playerId} act={act} />
    </div>
  );
};
