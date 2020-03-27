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
  backgroundColor: "#EEEEEE",
  lineHeight: 1,
  textAlign: "center",
  margin: "4px",
  padding: "15px 10px",
  borderRadius: "4px",
  border: selected ? "1px solid darkgrey" : "1px solid white",
});

const colourMap = {
  red: "#E53935",
  blue: "#039BE5",
  green: "#66BB6A",
  yellow: "#FDD835",
};

//"linear-gradient(to bottom, blue, blue, green, green, yellow, yellow, orange, red, red, red)",
//"linear-gradient(to bottom, #039BE5, #039BE5, #66BB6A, #66BB6A, #FDD835, #FDD835, orange, #E53935, #E53935, #E53935)",
const cardColorStyles = (colour: Colour): React.CSSProperties => {
  if (colour === "rainbow") {
    return {
      backgroundImage:
        "linear-gradient(to bottom, #039BE5, #039BE5, #66BB6A, #66BB6A, #FDD835, #FDD835, orange, #E53935, #E53935, #E53935)",
      WebkitBackgroundClip: "text",
      color: "transparent",
    };
  } else if (colour === "white") {
    return {
      textShadow: "1px 1px 6px #BDBDBD",
    };
  }
  return {
    color: colourMap[colour],
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
      cursor: onSelect ? "pointer" : "default",
      color: card.colour,
    }}
    onClick={onSelect}
  >
    <div
      style={{
        ...cardColorStyles(card.colour),
        fontSize: "30px",
      }}
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
  <Flex sx={{ flexDirection: "column", width: "100px" }} m={1}>
    <div
      style={{
        ...commonCardStyles(selected),
        color: "darkgrey",
        alignSelf: "center",
        fontSize: "50px",
        cursor: onSelect ? "pointer" : "default",
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
    <Button
      variant={canAct ? "hanabi" : "hanabiDisabled"}
      onClick={canAct ? onPlay : undefined}
      mb={1}
    >
      <FontAwesomeIcon icon={faPlay} /> Play
    </Button>
    <Button
      variant={canAct ? "hanabi" : "hanabiDisabled"}
      onClick={canAct ? onDiscard : undefined}
    >
      <FontAwesomeIcon icon={faTrash} /> Discard
    </Button>
  </Flex>
);
