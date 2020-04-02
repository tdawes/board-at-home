import { faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { Button, Flex } from "theme-ui";
import { Action, Card } from "../../api";
import { ActionableCard, CardDisplay } from "./Card";

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
  <Flex
    sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}
    key={name}
    mt={3}
  >
    <div>
      <span
        style={{ marginRight: "4px", color: isCurrentPlayer ? "#00897B" : "" }}
      >
        <FontAwesomeIcon icon={faUser} style={{ marginRight: "4px" }} />
        {name}
      </span>
      's hand:{" "}
    </div>
    <Flex>
      {hand.map((card, cardIdx) => (
        <CardDisplay
          card={card}
          key={cardIdx}
          selected={selected.includes(cardIdx)}
          onSelect={
            canAct ? () => act({ type: "select", handIdx, cardIdx }) : undefined
          }
        />
      ))}
    </Flex>
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
    <Flex mb={3} sx={{ flexWrap: "wrap", justifyContent: "center" }}>
      {hand.map((_card, cardIdx) => (
        <ActionableCard
          key={cardIdx}
          canAct={canAct}
          selected={selected.includes(cardIdx)}
          onPlay={() => act({ type: "play", cardIdx })}
          onDiscard={() => act({ type: "discard", cardIdx })}
          onSelect={
            canAct ? () => act({ type: "select", handIdx, cardIdx }) : undefined
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
      mb={3}
      sx={{ fontSize: "13px" }}
      title="If you want to select cards, do it before clicking this, as it will end your turn."
    >
      <FontAwesomeIcon icon={faInfoCircle} /> Give information
    </Button>
  </>
);
