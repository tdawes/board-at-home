import { Player } from "@board-at-home/api/src";
import {
  faExclamationCircle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { Colour, maxCardNum } from "../../api";

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
      height: "42px",
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
        to give other players information about them.
      </>
    ) : (
      <>
        <FontAwesomeIcon icon={faHourglassHalf} /> Waiting for{" "}
        <span style={{ color: "#00897B" }}>
          {currentPlayer.name || currentPlayer.id}
        </span>
        .
      </>
    )}
  </div>
);
