import * as React from "react";
import { Card, Colour, colourMap } from "../../api";

const commonCardStyles = (selected: boolean): React.CSSProperties => ({
  backgroundColor: "#EEEEEE",
  lineHeight: 1,
  textAlign: "center",
  padding: "15px 10px",
  borderRadius: "4px",
  border: selected ? "1px solid darkgrey" : "1px solid white",
  transition: "borderColor 100ms ease-in-out",
  minWidth: "41px",
});

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
      margin: "4px",
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

export const CardWidth = 50;
export const CardHeight = 80;
export const CardMargin = 8;

export const ActionableCard = ({
  selected,
  onSelect,
}: {
  selected: boolean;
  canAct: boolean;
  onPlay: () => any;
  onDiscard: () => any;
  onSelect?: () => any;
}) => (
  <div
    style={{
      ...commonCardStyles(selected),
      flexDirection: "column",
      width: `${CardWidth}px`,
      height: `${CardHeight}px`,
      color: "darkgrey",
      alignSelf: "center",
      fontSize: "50px",
      cursor: onSelect ? "pointer" : "default",
    }}
    onClick={onSelect}
  >
    ?
  </div>
);
