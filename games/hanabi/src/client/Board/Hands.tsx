import * as React from "react";
import { Button, Flex } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";
import { ActionableCard, CardDisplay } from "./Card";
import { Card, Action } from "../../api";

export const OtherPlayerHand = ({
  hand,
  selected,
  canAct,
  act,
  handIdx,
  name,
  isCurrentPlayer,
}: {
  hand: Card[];
  selected: number[];
  canAct: boolean;
  act: (action: Action) => any;
  handIdx: number;
  name: string;
  isCurrentPlayer: boolean;
}) => (
  <Flex sx={{ alignItems: "center" }} key={name} mt={3}>
    <span
      style={{ marginRight: "4px", color: isCurrentPlayer ? "#00897B" : "" }}
    >
      <FontAwesomeIcon icon={faUser} style={{ marginRight: "4px" }} />
      {name}
    </span>
    's hand:{" "}
    {hand.map((card, cardIdx) => (
      <CardDisplay
        card={card}
        key={cardIdx}
        selected={selected.includes(cardIdx)}
        onSelect={
          canAct
            ? () => act({ type: "select", handIdx: handIdx, cardIdx })
            : undefined
        }
      />
    ))}
  </Flex>
);

export const ThisPlayerHand = ({
  hand,
  selected,
  canAct,
  act,
  handIdx,
  canGiveInfo,
}: {
  hand: Card[];
  selected: number[];
  canAct: boolean;
  act: (action: Action) => any;
  handIdx: number;
  canGiveInfo: boolean;
}) => (
  <>
    <Flex mb={2}>
      {hand.map((_card, cardIdx) => (
        <ActionableCard
          key={cardIdx}
          canAct={canAct}
          selected={selected.includes(cardIdx)}
          onPlay={() => act({ type: "play", cardIdx })}
          onDiscard={() => act({ type: "discard", cardIdx })}
          onSelect={
            canAct
              ? () => act({ type: "select", handIdx: handIdx, cardIdx })
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
            cardIdx < hand.length - 1
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
    <Button
      variant={canGiveInfo ? "hanabi" : "hanabiDisabled"}
      onClick={canGiveInfo ? () => act({ type: "info" }) : undefined}
      mb={2}
      sx={{ fontSize: "13px" }}
    >
      <FontAwesomeIcon icon={faInfoCircle} /> Give information
    </Button>
  </>
);
