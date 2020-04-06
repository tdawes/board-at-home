import { faInfoCircle, faUser } from "@fortawesome/free-solid-svg-icons";
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
    <Flex>
      <FontAwesomeIcon icon={faUser} style={{ marginRight: "4px" }} />
      <div
        style={{
          maxWidth: "300px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginRight: "4px",
          color: isCurrentPlayer ? "#00897B" : "",
        }}
      >
        {name}
      </div>
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

// TODO: show them one by one vertically and allow moving that way on mobile?
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
}) => {
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
    const curCol = _.clamp(
      Math.round((curIndex * mod + x) / mod),
      0,
      hand.length - 1,
    );
    const newOrder: number[] = order.current.slice();
    newOrder.splice(curIndex, 1);
    newOrder.splice(curCol, 0, originalIndex);
    setSprings(fn(newOrder, down, originalIndex, curIndex, x) as any);
    if (!down) order.current = newOrder;
  });

  return (
    <>
      <div
        style={{
          margin: "16px",
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
              canAct={canAct}
              selected={selected.includes(cardIdx)}
              onPlay={() => act({ type: "play", cardIdx })}
              onDiscard={() => act({ type: "discard", cardIdx })}
              onSelect={
                canAct
                  ? () => act({ type: "select", handIdx, cardIdx })
                  : undefined
              }
            />
          </animated.div>
        ))}
      </div>
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
};
