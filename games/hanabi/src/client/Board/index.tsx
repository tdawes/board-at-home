import { BoardProps } from "@board-at-home/api";
import * as _ from "lodash";
import * as React from "react";
import { Flex } from "theme-ui";
import { Action, Config, State } from "../../api";
import { OtherPlayerHand, ThisPlayerHand } from "./Hands";
import PlayerMessage from "./PlayerMessage";
import Table from "./Table";

// TODO: animations, highlight card changes
// flip on play/discard
// then highlight/slide in to table piles
// slide away from deck when drawing
// and slide into place in hand in on draw
// swap on move (easier if we assume big screen...)
export const Board = ({
  game,
  playerId,
  act,
}: BoardProps<State, Action, Config>) => {
  const playerIdx = Object.keys(game.players).indexOf(playerId);
  const canAct = !game.state.finished && game.state.currentPlayer === playerIdx;
  const canGiveInfo =
    canAct &&
    !game.state.finished &&
    game.state.currentPlayer === playerIdx &&
    game.state.board.infoTokens > 0;

  return (
    <Flex
      className="board"
      sx={{ width: "100%", justifyContent: "center", flexWrap: "wrap" }}
    >
      <Flex
        sx={{
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ThisPlayerHand
          hand={game.state.board.hands[playerIdx]}
          selected={game.state.selectedCards[playerIdx]}
          canAct={canAct}
          canGiveInfo={canGiveInfo}
          act={act}
          handIdx={playerIdx}
        />
        <PlayerMessage
          playerId={playerId}
          currentPlayer={Object.values(game.players)[game.state.currentPlayer]}
          finished={game.state.finished}
          piles={game.state.board.piles}
        />
        <Flex
          sx={{
            flexDirection: "column",
            alignItems: "flex-end",
          }}
          mb={3}
        >
          {Object.keys(game.players).map((id, idx) =>
            id !== playerId ? (
              <OtherPlayerHand
                hand={game.state.board.hands[idx]}
                selected={game.state.selectedCards[idx]}
                canAct={canAct}
                act={act}
                name={game.players[id].name || game.players[id].id}
                handIdx={idx}
                isCurrentPlayer={game.state.currentPlayer === idx}
              />
            ) : (
              <div key={id} />
            ),
          )}
        </Flex>
      </Flex>
      <Table game={game} />
    </Flex>
  );
};
