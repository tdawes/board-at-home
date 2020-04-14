import {
  faInfoCircle,
  faPlay,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { animated, interpolate, useSprings } from "react-spring";
import { useDrag } from "react-use-gesture";
import { Button, Flex } from "theme-ui";
import { Action, Card } from "../../api";
import {
  ActionableCard,
  CardDisplay,
  CardHeight,
  CardMargin,
  CardWidth,
} from "./Card";
import { PlayerName } from "./PlayerMessage";

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
    sx={{
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "center",
      maxWidth: "400px",
    }}
    key={name}
    mt={3}
  >
    <Flex
      sx={{
        alignItems: "center",
      }}
    >
      <FontAwesomeIcon icon={faUser} style={{ marginRight: "4px" }} />
      <PlayerName name={name} isCurrentPlayer={isCurrentPlayer} />
      's hand:{" "}
    </Flex>
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
  handIdx,
  canAct,
  act,
  canGiveInfo,
}: {
  hand: Card[];
  selected: number[];
  handIdx: number;
  canAct: boolean;
  act: (action: Action) => any;
  canGiveInfo: boolean;
}) => {
  const [selectedCard, setSelectedCard] = React.useState(-1);
  const mod = CardWidth + 2 * CardMargin;
  const fn = (
    order: number[],
    down?: boolean,
    originalIndex?: number,
    curIndex?: number,
    x?: number,
  ) => (index: number) =>
    down && index === originalIndex && curIndex !== undefined && x !== undefined
      ? {
          x: curIndex * mod + x,
          scale: 1.1,
          zIndex: "1",
          shadow: 15,
          immediate: (n: string) => n === "x" || n === "zIndex",
        }
      : {
          x: order.indexOf(index) * mod,
          scale: 1,
          zIndex: "0",
          shadow: 1,
          immediate: (_n: string) => false,
        };

  const order = React.useRef(hand.map((_, index) => index));
  const [springs, setSprings] = useSprings(hand.length, fn(order.current));

  const bind = useDrag(({ args: [originalIndex], down, movement: [x] }) => {
    const curIndex = order.current.indexOf(originalIndex);
    const newIndex = _.clamp(
      Math.round((curIndex * mod + x) / mod),
      0,
      hand.length - 1,
    );
    const newOrder: number[] = order.current.slice();
    newOrder.splice(curIndex, 1);
    newOrder.splice(newIndex, 0, originalIndex);
    setSprings(fn(newOrder, down, originalIndex, curIndex, x) as any);
    if (!down) {
      if (!_.isEqual(order.current, newOrder)) {
        act({
          type: "move",
          cardIdx: curIndex,
          newIdx: newIndex,
        });
        order.current = newOrder;
      } else if (canAct) {
        setSelectedCard(originalIndex);
        act({ type: "selectOnly", cardIdx: curIndex, handIdx });
      }
    }
  });

  const readyToAct = canAct && selectedCard >= 0;
  return (
    <>
      <div
        style={{
          margin: "8px",
          height: `${CardHeight + 2 * CardMargin}px`,
          width: `${hand.length * mod}px`,
          position: "relative",
        }}
      >
        {springs.map(({ zIndex, shadow, x, scale }, cardIdx: number) => (
          <animated.div
            {...bind(cardIdx)}
            key={cardIdx}
            style={{
              position: "absolute",
              width: `${CardWidth}px`,
              overflow: "visible",
              pointerEvents: "auto",
              cursor: "pointer",
              transformOrigin: "50% 50% 0px",
              borderRadius: "4px",
              zIndex: zIndex as any,
              boxShadow: shadow.interpolate(
                (s: number) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`,
              ),
              transform: interpolate(
                [x, scale],
                (x, s) => `translate3d(${x}px,0,0) scale(${s})`,
              ),
            }}
          >
            <ActionableCard
              key={cardIdx}
              selected={
                canAct
                  ? selectedCard === cardIdx
                  : selected.includes(order.current.indexOf(cardIdx))
              }
            />
          </animated.div>
        ))}
      </div>
      <Flex>
        <Button
          variant={canGiveInfo ? "hanabi" : "hanabiDisabled"}
          onClick={canGiveInfo ? () => act({ type: "info" }) : undefined}
          mb={3}
          sx={{ fontSize: "13px" }}
          title={
            canGiveInfo
              ? "If you want to select cards, do it before clicking this, as it will end your turn."
              : canAct
              ? "Out of information tokens."
              : "Wait for your turn."
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} /> Give information
        </Button>
        <Button
          variant={readyToAct ? "hanabi" : "hanabiDisabled"}
          onClick={
            canAct
              ? () => act({ type: "play", cardIdx: selectedCard })
              : undefined
          }
          mb={3}
          sx={{ fontSize: "13px" }}
          title={
            readyToAct
              ? `Play card in position ${selectedCard + 1}`
              : canAct
              ? "Please select a card to play first."
              : "Wait for your turn."
          }
        >
          <FontAwesomeIcon icon={faPlay} /> Play selected card
        </Button>
        <Button
          variant={readyToAct ? "hanabi" : "hanabiDisabled"}
          onClick={
            canAct
              ? () => act({ type: "discard", cardIdx: selectedCard })
              : undefined
          }
          mb={3}
          sx={{ fontSize: "13px" }}
          title={
            readyToAct
              ? `Discard card in position ${selectedCard + 1}`
              : canAct
              ? "Please select a card to discard first."
              : "Wait for your turn."
          }
        >
          <FontAwesomeIcon icon={faTrash} /> Discard selected card
        </Button>
      </Flex>
    </>
  );
};
