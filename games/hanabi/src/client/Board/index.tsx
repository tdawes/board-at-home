import * as React from "react";
import { State, Action, Config } from "../../api";
import { BoardProps } from "@board-at-home/api";
import { Flex } from "theme-ui";
import * as _ from "lodash";
import Table from "./Table";
import { ThisPlayerHand, OtherPlayerHand } from "./Hands";
import PlayerMessage from "./PlayerMessage";

export const Board = ({
  game,
  playerId,
  act,
}: BoardProps<State, Action, Config>) => {
  const playerIdx = Object.keys(game.players).indexOf(playerId);
  const canAct = !game.state.finished && game.state.currentPlayer == playerIdx;
  const canGiveInfo =
    canAct &&
    !game.state.finished &&
    game.state.currentPlayer === playerIdx &&
    game.state.board.infoTokens > 0;

  return (
    <Flex className="board">
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PlayerMessage
          playerId={playerId}
          currentPlayer={Object.values(game.players)[game.state.currentPlayer]}
          finished={game.state.finished}
          piles={game.state.board.piles}
        />
        <ThisPlayerHand
          hand={game.state.board.hands[playerIdx]}
          selected={game.state.selectedCards[playerIdx]}
          canAct={canAct}
          canGiveInfo={canGiveInfo}
          act={act}
          handIdx={playerIdx}
        />
        {Object.keys(game.players).map((id, idx) =>
          id != playerId ? (
            <OtherPlayerHand
              hand={game.state.board.hands[idx]}
              selected={game.state.selectedCards[idx]}
              canAct={canAct}
              act={act}
              name={game.players[id].name || game.players[id].id}
              handIdx={idx}
            />
          ) : (
            <div key={id} />
          ),
        )}
      </Flex>
      <Table game={game} />
    </Flex>
  );
};
