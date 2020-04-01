import * as React from "react";
import { Player } from "@board-at-home/api/src";
import { maxCardNum, Colour } from "../../api";
import * as _ from "lodash";

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
}) => {
  if (finished) {
    if (_.every(Object.values(piles), num => num == maxCardNum)) {
      return <div>You won!</div>;
    }
    return <div>You lost... Score: {_.sum(Object.values(piles))}</div>;
  }
  if (currentPlayer.id === playerId) {
    return <div>It's your turn.</div>;
  }
  return (
    <div>
      Waiting for{" "}
      <span style={{ color: "#00897B" }}>
        {currentPlayer.name || currentPlayer.id}
      </span>
      .
    </div>
  );
};
