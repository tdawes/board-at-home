/** @jsx jsx */
import _ from "lodash";
import * as React from "react";
import { jsx, Button } from "theme-ui";
import { BoardProps, StartedGame } from "@board-at-home/api/src";
import {
  State,
  Action,
  Config,
  DecideDiscardUserInput,
  DiscardCardUserInput,
  RespondToChallengeUserInput,
  RevealCardUserInput,
} from "../api";
import Modal from "react-modal";
import { conditionFromAction, isCurrentPlayer } from "../utils";
import { name } from "./utils";

const ChooseTargetModal = ({
  show,
  onSelect,
  game,
  playerId,
  ownTeam,
  onClose,
}: {
  show?: boolean;
  onSelect: (target: string) => void;
  game: StartedGame<State, Config>;
  playerId: string;
  ownTeam?: boolean;
  onClose: () => void;
}) => {
  const otherPlayers = Object.keys(game.players).filter(
    other =>
      other !== playerId && game.state.players[other].liveCards.length > 0,
  );
  let possibleTargets = otherPlayers.filter(
    other =>
      game.state.players[other].team !== game.state.players[playerId].team,
  );
  if (possibleTargets.length === 0 || ownTeam) {
    possibleTargets = otherPlayers;
  }
  return (
    <Modal isOpen={!!show}>
      {possibleTargets.map(other => (
        <Button onClick={() => onSelect(other)}>
          {game.players[other].name || other}
        </Button>
      ))}
      <Button onClick={onClose}>Cancel</Button>
    </Modal>
  );
};

const CollectIncomeButton = ({
  playerId,
  act,
}: BoardProps<State, Action, Config>) => (
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
}: BoardProps<State, Action, Config>) => (
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

const CoupButton = ({
  playerId,
  game,
  act,
}: BoardProps<State, Action, Config>) => {
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
        onClose={() => setShowModal(false)}
      />
      <Button onClick={() => setShowModal(true)}>Coup</Button>
    </React.Fragment>
  );
};

const EmbezzleButton = ({
  playerId,
  act,
}: BoardProps<State, Action, Config>) => (
  <Button
    onClick={() =>
      act({ type: "play", playerId, action: { type: "embezzle" } })
    }
  >
    Embezzle
  </Button>
);

const ConvertSelfButton = ({
  playerId,
  act,
}: BoardProps<State, Action, Config>) => (
  <Button
    onClick={() => act({ type: "play", playerId, action: { type: "convert" } })}
  >
    Defect
  </Button>
);

const ConvertOtherButton = ({
  playerId,
  game,
  act,
}: BoardProps<State, Action, Config>) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <React.Fragment>
      <ChooseTargetModal
        show={showModal}
        onSelect={target => {
          act({ type: "play", action: { type: "convert", target }, playerId });
          setShowModal(false);
        }}
        game={game}
        playerId={playerId}
        ownTeam
        onClose={() => setShowModal(false)}
      />
      <Button onClick={() => setShowModal(true)}>Recruit</Button>
    </React.Fragment>
  );
};

const CollectTaxButton = ({
  playerId,
  act,
}: BoardProps<State, Action, Config>) => (
  <Button
    onClick={() => act({ type: "play", playerId, action: { type: "tax" } })}
  >
    Collect Tax
  </Button>
);

const AssassinateButton = ({
  playerId,
  game,
  act,
}: BoardProps<State, Action, Config>) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <React.Fragment>
      <ChooseTargetModal
        show={showModal}
        onSelect={target => {
          act({
            type: "play",
            action: { type: "assassinate", target },
            playerId,
          });
          setShowModal(false);
        }}
        game={game}
        playerId={playerId}
        onClose={() => setShowModal(false)}
      />
      <Button onClick={() => setShowModal(true)}>Assassinate</Button>
    </React.Fragment>
  );
};

const StealButton = ({
  playerId,
  game,
  act,
}: BoardProps<State, Action, Config>) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <React.Fragment>
      <ChooseTargetModal
        show={showModal}
        onSelect={target => {
          act({ type: "play", action: { type: "steal", target }, playerId });
          setShowModal(false);
        }}
        game={game}
        playerId={playerId}
        onClose={() => setShowModal(false)}
      />
      <Button onClick={() => setShowModal(true)}>Steal</Button>
    </React.Fragment>
  );
};

const ExchangeButton = ({
  playerId,
  game,
  act,
}: BoardProps<State, Action, Config>) => (
  <Button
    onClick={() =>
      act({
        type: "play",
        playerId,
        action: {
          type: game.config.useExpansion ? "exchange-1" : "exchange-2",
        },
      })
    }
  >
    Exchange
  </Button>
);

const ExamineButton = ({
  playerId,
  game,
  act,
}: BoardProps<State, Action, Config>) => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <React.Fragment>
      <ChooseTargetModal
        show={showModal}
        onSelect={target => {
          act({ type: "play", action: { type: "examine", target }, playerId });
          setShowModal(false);
        }}
        game={game}
        playerId={playerId}
        onClose={() => setShowModal(false)}
      />
      <Button onClick={() => setShowModal(true)}>Examine</Button>
    </React.Fragment>
  );
};

const BlockForeignAidButton = ({
  act,
  playerId,
}: BoardProps<State, Action, Config>) => (
  <Button onClick={() => act({ type: "react", card: "duke", playerId })}>
    Block Foreign Aid
  </Button>
);

const BlockAssassinationButton = ({
  act,
  playerId,
}: BoardProps<State, Action, Config>) => (
  <Button onClick={() => act({ type: "react", card: "contessa", playerId })}>
    Block Assassination
  </Button>
);

const BlockStealingButton = ({
  act,
  game,
  playerId,
}: BoardProps<State, Action, Config>) => {
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
        {game.config.useExpansion ? (
          <Button
            onClick={() => act({ type: "react", card: "inquisitor", playerId })}
          >
            Inquisitor
          </Button>
        ) : (
          <Button
            onClick={() => act({ type: "react", card: "ambassador", playerId })}
          >
            Ambassador
          </Button>
        )}
        <Button onClick={() => setShowModal(false)}>Cancel</Button>
      </Modal>
      <Button onClick={() => setShowModal(true)}>Block Stealing</Button>
    </React.Fragment>
  );
};

const ChallengeButton = ({
  game,
  act,
  playerId,
}: BoardProps<State, Action, Config>) => (
  <Button
    onClick={() =>
      act({
        type: "challenge",
        playerId,
        id: game.state.currentReaction?.id || game.state.currentAction!.id,
        condition: conditionFromAction(
          game.state.currentReaction?.action ||
            game.state.currentAction!.action,
        ),
      })
    }
  >
    Challenge
  </Button>
);

const AcceptButton = ({
  act,
  game,
  playerId,
}: BoardProps<State, Action, Config>) => (
  <Button
    onClick={() =>
      act({
        type: "accept",
        id: game.state.currentReaction?.id || game.state.currentAction!.id,
        playerId,
      })
    }
  >
    Accept
  </Button>
);

const DecideDiscardButton = ({
  game,
  playerId,
  act,
  event,
}: BoardProps<State, Action, Config> & { event: DecideDiscardUserInput }) => (
  <div>
    <div>
      Should {name(game, event.target)} replace their {_.capitalize(event.card)}
      ?
    </div>
    <Button
      onClick={() =>
        act({
          type: "force-replace",
          playerId,
          target: event.target,
          card: event.card,
        })
      }
    >
      Replace
    </Button>
    <Button
      onClick={() =>
        act({
          type: "force-replace-cancel",
          playerId,
          target: event.target,
          card: event.card,
        })
      }
    >
      Keep
    </Button>
  </div>
);

const DiscardCardButton = ({
  game,
  playerId,
  act,
  event,
}: BoardProps<State, Action, Config> & { event: DiscardCardUserInput }) => {
  const [toDiscard, setToDiscard] = React.useState<number[]>([]);
  return (
    <div>
      <div>Choose {event.amount - toDiscard.length} cards to discard:</div>
      {game.state.players[playerId].liveCards.map((card, index) => {
        if (!toDiscard.includes(index)) {
          return (
            <Button
              onClick={() => {
                setToDiscard(c => {
                  const newList = [...c, index];
                  if (newList.length === event.amount) {
                    act({
                      type: "discard",
                      playerId,
                      cards: game.state.players[
                        playerId
                      ].liveCards.filter((_card, index) =>
                        newList.includes(index),
                      ),
                    });
                  }
                  return newList;
                });
              }}
            >
              {_.capitalize(card)}
            </Button>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export const LoseInfluenceButton = ({
  game,
  playerId,
  act,
}: BoardProps<State, Action, Config>) => {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (
      game.state.players[playerId].liveCards.length <=
      game.state.requiredUserInputs[playerId].filter(
        userInput => userInput.type === "lose-influence",
      ).length
    ) {
      act({
        type: "lose-influence",
        playerId,
        card: game.state.players[playerId].liveCards[0],
      });
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <div>
      <div>Choose a card to lose:</div>
      {game.state.players[playerId].liveCards.map(card => (
        <Button onClick={() => act({ type: "lose-influence", playerId, card })}>
          {_.capitalize(card)}
        </Button>
      ))}
    </div>
  );
};

export const RespondToChallengeButton = ({
  game,
  playerId,
  act,
  event,
}: BoardProps<State, Action, Config> & {
  event: RespondToChallengeUserInput;
}) => (
  <div>
    <div>Respond to the challenge:</div>
    {(event.condition.type === "must-have") ===
      game.state.players[playerId].liveCards.includes(event.condition.card) && (
      <Button
        onClick={() =>
          act({
            type: "respond-to-challenge",
            condition: event.condition,
            challenger: game.state.currentChallenge!.playerId,
            playerId,
            succeed: true,
          })
        }
      >
        Reveal{" "}
        {event.condition.type === "must-have"
          ? `a ${_.capitalize(event.condition.card)}`
          : `no ${_.capitalize(event.condition.card)}`}
      </Button>
    )}
    <Button
      onClick={() =>
        act({
          type: "respond-to-challenge",
          condition: event.condition,
          challenger: game.state.currentChallenge!.playerId,
          playerId,
          succeed: false,
        })
      }
    >
      Concede
    </Button>
  </div>
);

const RevealCardButton = ({
  game,
  playerId,
  act,
  event,
}: BoardProps<State, Action, Config> & {
  event: RevealCardUserInput;
}) => (
  <div>
    <div>Choose a card to reveal to {name(game, event.target)}:</div>
    {game.state.players[playerId].liveCards.map(card => (
      <Button
        onClick={() =>
          act({ type: "reveal", playerId, target: event.target, card })
        }
      >
        {_.capitalize(card)}
      </Button>
    ))}
  </div>
);

export default (props: BoardProps<State, Action, Config>) => {
  const { game, playerId } = props;
  if (game.state.finished) {
    return null;
  }

  if (game.state.players[playerId].liveCards.length === 0) {
    return <div>You are out.</div>;
  }

  if (
    Object.keys(game.state.requiredUserInputs).some(
      other =>
        game.state.players[other].liveCards.length > 0 &&
        game.state.requiredUserInputs[other].length > 0,
    )
  ) {
    if (game.state.requiredUserInputs[playerId].length > 0) {
      return (
        <div>
          {game.state.requiredUserInputs[playerId].map(userEvent => {
            if (userEvent.type === "decide-discard") {
              return <DecideDiscardButton event={userEvent} {...props} />;
            } else if (userEvent.type === "discard-card") {
              return <DiscardCardButton event={userEvent} {...props} />;
            } else if (userEvent.type === "lose-influence") {
              return <LoseInfluenceButton {...props} />;
            } else if (userEvent.type === "respond-to-challenge") {
              return <RespondToChallengeButton event={userEvent} {...props} />;
            } else if (userEvent.type === "reveal-card") {
              return <RevealCardButton event={userEvent} {...props} />;
            }
          })}
        </div>
      );
    } else {
      return (
        <div>
          {Object.keys(game.state.requiredUserInputs)
            .filter(other => game.state.requiredUserInputs[other].length > 0)
            .map(other => (
              <div>
                Waiting for {name(game, other)} to{" "}
                {game.state.requiredUserInputs[other]
                  .map(userEvent => {
                    if (userEvent.type === "decide-discard") {
                      return `decide whether ${
                        userEvent.target === playerId
                          ? "you"
                          : name(game, userEvent.target)
                      } should discard ${
                        userEvent.target === playerId ? "your" : "their"
                      } card`;
                    } else if (userEvent.type === "discard-card") {
                      return "discard their card";
                    } else if (userEvent.type === "lose-influence") {
                      return "choose a card to discard";
                    } else if (userEvent.type === "respond-to-challenge") {
                      return "respond to the challenge";
                    } else if (userEvent.type === "reveal-card") {
                      return `reveal a card to ${
                        userEvent.target === playerId
                          ? "you"
                          : name(game, userEvent.target)
                      }`;
                    }
                  })
                  .join(" and to ")}
                .
              </div>
            ))}
        </div>
      );
    }
  }

  const canPlay =
    isCurrentPlayer(game.state, playerId) && game.state.currentAction == null;
  const canReact =
    !isCurrentPlayer(game.state, playerId) &&
    game.state.currentAction != null &&
    game.state.currentReaction == null &&
    game.state.currentChallenge == null &&
    !game.state.currentAction.accepted[playerId];
  const canChallenge =
    game.state.currentChallenge == null &&
    (game.state.currentAction != null || game.state.currentReaction != null) &&
    !(game.state.currentReaction || game.state.currentAction)?.accepted[
      playerId
    ];

  return (
    <div>
      {canPlay && (
        <React.Fragment>
          {game.state.players[playerId].money >= 10 ? (
            <CoupButton {...props} />
          ) : (
            <React.Fragment>
              <CollectIncomeButton {...props} />
              <CollectForeignAidButton {...props} />
              {game.state.players[playerId].money >= 7 && (
                <CoupButton {...props} />
              )}
              {game.config.useExpansion && game.state.treasury > 0 && (
                <EmbezzleButton {...props} />
              )}
              {game.config.useExpansion &&
                Object.keys(game.state.players).filter(
                  other => game.state.players[other].liveCards.length > 0,
                ).length > 2 &&
                game.state.players[playerId].money >= 1 && (
                  <ConvertSelfButton {...props} />
                )}
              {game.config.useExpansion &&
                Object.keys(game.state.players).filter(
                  other => game.state.players[other].liveCards.length > 0,
                ).length > 2 &&
                game.state.players[playerId].money >= 2 && (
                  <ConvertOtherButton {...props} />
                )}
              <CollectTaxButton {...props} />
              {game.state.players[playerId].money >= 3 && (
                <AssassinateButton {...props} />
              )}
              <StealButton {...props} />
              <ExchangeButton {...props} />
              {game.config.useExpansion && <ExamineButton {...props} />}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {canReact && (
        <React.Fragment>
          {game.state.currentAction!.action.action.type === "foreign-aid" && (
            <BlockForeignAidButton {...props} />
          )}
          {game.state.currentAction!.action.action.type === "assassinate" && (
            <BlockAssassinationButton {...props} />
          )}
          {game.state.currentAction!.action.action.type === "steal" && (
            <BlockStealingButton {...props} />
          )}
        </React.Fragment>
      )}
      {canChallenge && (
        <React.Fragment>
          <AcceptButton {...props} />
          <ChallengeButton {...props} />
        </React.Fragment>
      )}
      {!canPlay && !canReact && !canChallenge && "No available actions."}
    </div>
  );
};
