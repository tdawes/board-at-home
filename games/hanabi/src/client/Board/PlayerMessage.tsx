import { Player } from "@board-at-home/api/src";
import {
  faExclamationCircle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { Flex } from "theme-ui";
import { Colour, maxCardNum } from "../../api";

export const PlayerName = ({
  isCurrentPlayer,
  name,
}: {
  isCurrentPlayer: boolean;
  name: string;
}) => (
  <div
    style={{
      maxWidth: "230px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      marginRight: "4px",
      color: isCurrentPlayer ? "#00897B" : "",
    }}
  >
    {name}
  </div>
);

export default ({
  playerId,
  currentPlayer,
  finished,
  piles,
}: {
  playerId: string;
  currentPlayer: Player;
  finished: boolean;
  piles: { [key in Colour]: number };
}) => (
  <div
    style={{
      marginTop: "8px",
      maxWidth: "440px",
      fontSize: "14px",
      height: "60px",
    }}
  >
    {finished ? (
      _.every(Object.values(piles), num => num === maxCardNum) ? (
        "You won!"
      ) : (
        `You lost... Score: ${_.sum(Object.values(piles))}`
      )
    ) : currentPlayer.id === playerId ? (
      <>
        <span style={{ color: "#00897B" }}>
          <FontAwesomeIcon icon={faExclamationCircle} /> It's your turn.
        </span>{" "}
        You can choose a card to play or discard, or select other players' cards
        to give information about them.
      </>
    ) : (
      <Flex
        sx={{
          alignItems: "center",
        }}
        pt={3}
      >
        <FontAwesomeIcon icon={faHourglassHalf} />
        <span style={{ margin: "0 4px" }}> Waiting for</span>
        <PlayerName
          name={currentPlayer.name || currentPlayer.id}
          isCurrentPlayer={true}
        />
      </Flex>
    )}
  </div>
);
