import * as React from "react";
import { Card } from "../../api";
import { Flex, IconButton, Button } from "theme-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faTrash,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

// TODO: make these styles fit into the theme components
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
      color: card.color,
      backgroundColor: "lightgrey",
      fontSize: "30px",
      margin: "5px",
      padding: "12px 10px 10px",
      borderRadius: "4px",
      width: "35px",
      height: "50px",
      display: "inline",
      lineHeight: 1,
      border: selected ? "1px solid blue" : "1px solid white",
    }}
    onClick={onSelect}
  >
    {card.num}
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
        color: "darkgrey",
        backgroundColor: "lightgrey",
        fontSize: "30px",
        margin: "5px",
        padding: "15px 15px 10px",
        borderRadius: "4px",
        width: "45px",
        height: "55px",
        display: "table",
        alignSelf: "center",
        border: selected ? "1px solid blue" : "1px solid white",
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
