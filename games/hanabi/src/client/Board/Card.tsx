import * as React from "react";
import { Card, Colour } from "../../api";
import { Flex, IconButton, Button } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTrash,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const commonCardStyles = (selected: boolean): React.CSSProperties => ({
  backgroundColor: "lightgrey",
  lineHeight: 1,
  textAlign: "center",
  margin: "5px",
  padding: "15px 10px",
  borderRadius: "4px",
  border: selected ? "1px solid blue" : "1px solid white",
});

const cardColorStyles = (colour: Colour): React.CSSProperties => {
  if (colour === "rainbow") {
    return {
      backgroundImage:
        "linear-gradient(to bottom, blue, blue, green, green, yellow, yellow, orange, red, red, red)",
      WebkitBackgroundClip: "text",
      color: "transparent",
    };
  }
  return {
    color: colour,
  };
};

export const CardDisplay = ({
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
      ...commonCardStyles(selected),
      color: card.colour,
    }}
  >
    <div
      style={{
        ...cardColorStyles(card.colour),
        fontSize: "30px",
      }}
      onClick={onSelect}
    >
      {card.num}
    </div>
  </div>
);

export const ActionableCard = ({
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
        ...commonCardStyles(selected),
        color: "darkgrey",
        alignSelf: "center",
        fontSize: "50px",
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
