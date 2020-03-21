/** @jsx jsx */
import * as React from "react";
import { jsx, Button } from "theme-ui";
import { BoardProps, StartedGame } from "@board-at-home/api/src";
import { State, Action } from "../api";
import Modal from "react-modal";

const ChooseTargetModal = ({
  show,
  onSelect,
  game,
  playerId,
}: {
  show?: boolean;
  onSelect: (target: string) => void;
  game: StartedGame<State>;
  playerId: string;
}) => {
  const otherPlayers = Object.keys(game.players).filter(
    other => other !== playerId,
  );
  let possibleTargets = otherPlayers.filter(
    other =>
      game.state.players[other].team !== game.state.players[playerId].team,
  );
  if (possibleTargets.length === 0) {
    possibleTargets = otherPlayers;
  }
  return (
    <Modal isOpen={!!show}>
      {possibleTargets.map(other => (
        <Button onClick={() => onSelect(other)}>
          {game.players[other].name || other}
        </Button>
      ))}
    </Modal>
  );
};

const CollectIncomeButton = ({ playerId, act }: BoardProps<State, Action>) => (
  <Button
    onClick={() =>
      act({
        type: "play",
        action: {
          type: "income",
        },
        playerId,
      })
    }
  >
    Collect Income (1 coin)
  </Button>
);

const CollectForeignAidButton = ({
  playerId,
  act,
}: BoardProps<State, Action>) => (
  <Button
    onClick={() =>
      act({
        type: "play",
        action: {
          type: "foreign-aid",
        },
        playerId,
      })
    }
  >
    Collect Foreign Aid (2 coins)
  </Button>
);

const CoupButton = ({ playerId, game, act }: BoardProps<State, Action>) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <React.Fragment>
      <ChooseTargetModal
        show={showModal}
        onSelect={target => {
          act({ type: "play", action: { type: "coup", target }, playerId });
          setShowModal(false);
        }}
        game={game}
        playerId={playerId}
      />
      <Button onClick={() => setShowModal(true)}>Coup</Button>
    </React.Fragment>
  );
};

const BlockForeignAidButton = ({
  act,
  playerId,
}: BoardProps<State, Action>) => (
  <Button onClick={() => act({ type: "react", card: "duke", playerId })}>
    Block Foreign Aid
  </Button>
);

const BlockAssassinationButton = ({
  act,
  playerId,
}: BoardProps<State, Action>) => (
  <Button onClick={() => act({ type: "react", card: "contessa", playerId })}>
    Block Assassination
  </Button>
);

const BlockStealingButton = ({ act, playerId }: BoardProps<State, Action>) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <React.Fragment>
      <Modal isOpen={showModal}>
        Select card to use:
        <Button
          onClick={() => act({ type: "react", card: "captain", playerId })}
        >
          Captain
        </Button>
        <Button
          onClick={() => act({ type: "react", card: "ambassador", playerId })}
        >
          Ambassador
        </Button>
        <Button
          onClick={() => act({ type: "react", card: "inquisitor", playerId })}
        >
          Inquisitor
        </Button>
      </Modal>
      <Button onClick={() => setShowModal(true)}>Block Stealing</Button>
    </React.Fragment>
  );
};

const ChallengeButton = ({ act, playerId }: BoardProps<State, Action>) => (
  <Button onClick={() => act({ type: "challenge", playerId })}>
    Challenge
  </Button>
);

export default (props: BoardProps<State, Action>) => {
  const { game, playerId } = props;
  if (game.state.finished) {
    return null;
  }

  const canPlay =
    game.state.playerOrder[game.state.currentPlayer] === playerId &&
    (game.state.stack.length === 0 ||
      game.state.stack[0].status === "resolved");
  const canReact =
    game.state.stack.length > 0 &&
    game.state.stack[0].action.type === "play" &&
    game.state.stack[0].playerId !== playerId &&
    game.state.stack[0].status === "played";
  const canChallenge =
    game.state.stack.length > 0 &&
    game.state.stack[0].action.playerId !== playerId &&
    game.state.stack[0].status === "played";

  if (canPlay) {
    const { money } = game.state.players[playerId];

    if (money >= 10) {
      return (
        <div>
          <CoupButton {...props} />
        </div>
      );
    }

    return (
      <div>
        <CollectIncomeButton {...props} />
        <CollectForeignAidButton {...props} />
        {money >= 1 && <CoupButton {...props} />}
      </div>
    );
  } else if (canReact) {
    return (
      <div>
        {game.state.stack[0].action.type === "play" &&
          game.state.stack[0].action.action.type === "foreign-aid" && (
            <BlockForeignAidButton {...props} />
          )}
        {game.state.stack[0].action.type === "play" &&
          game.state.stack[0].action.action.type === "assassinate" && (
            <BlockAssassinationButton {...props} />
          )}
        {game.state.stack[0].action.type === "play" &&
          game.state.stack[0].action.action.type === "steal" && (
            <BlockStealingButton {...props} />
          )}
      </div>
    );
  } else if (canChallenge) {
    return (
      <div>
        <ChallengeButton {...props} />
      </div>
    );
  }

  return <div>{game.players[playerId].name || playerId} has no actions.</div>;
};
