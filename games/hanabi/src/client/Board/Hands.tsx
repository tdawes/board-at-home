import * as React from "react";
import { Button, Flex } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
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
}: {
  hand: Card[];
  selected: number[];
  canAct: boolean;
  act: (action: Action) => any;
  handIdx: number;
  name: string;
}) => (
  <Flex sx={{ alignItems: "center" }} key={name}>
    {name}'s hand:{" "}
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
    <Flex mb={3}>
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
    {canGiveInfo && (
      <Button
        onClick={() => act({ type: "info" })}
        mb={4}
        sx={{ fontSize: "14px" }}
      >
        <FontAwesomeIcon icon={faInfoCircle} /> Give information
      </Button>
    )}
  </>
);
