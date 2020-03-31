import * as React from "react";
import { StartedGame } from "@board-at-home/api/src";
import { State, Config, Colour } from "../../../api";
import { CardDisplay } from "../Card";
import { Flex } from "theme-ui";
import Tokens from "./Tokens";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faBomb,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import * as _ from "lodash";

const CARD_HEIGHT = "72px";

export default ({ game }: { game: StartedGame<State, Config> }) => {
  // TODO: try discard in columns? or reorg so it doesn't move unexpectedly?
  const discarded = _.flatten(Object.values(game.state.board.discardPile));

  return (
    <Flex
      sx={{
        flexDirection: "column",
        backgroundColor: "#E1E1E1",
        alignItems: "center",
        borderRadius: "4px",
        width: "320px",
      }}
      p={3}
      m={1}
    >
      <Flex sx={{ height: CARD_HEIGHT }}>
        {(Object.keys(
          game.state.board.piles,
        ) as Colour[]).map((colour: Colour) =>
          game.state.board.piles[colour] > 0 ? (
            <CardDisplay
              card={{ colour, num: game.state.board.piles[colour] }}
              key={colour}
              selected={false}
            />
          ) : (
            <div style={{ height: CARD_HEIGHT }} key={colour} />
          ),
        )}
      </Flex>
      {game.state.board.deck.length} cards left in the deck.
      <Tokens
        num={game.state.board.infoTokens}
        total={game.config.infoTokens}
        icon={faInfoCircle}
      />
      <Tokens
        num={game.state.board.fuseTokens}
        total={game.config.fuseTokens}
        icon={faBomb}
      />
      {discarded.length > 0 && (
        <FontAwesomeIcon icon={faTrash} style={{ marginTop: "8px" }} />
      )}
      <Flex
        sx={{
          minHeight: CARD_HEIGHT,
          flexDirection: "column",
          alignItems: "center",
        }}
        m={2}
      >
        {Object.values(game.state.board.discardPile).map((pile, pileIdx) => (
          <Flex
            sx={{
              flexWrap: "wrap",
            }}
            key={pileIdx}
          >
            {pile.map((card, idx) => (
              <CardDisplay card={card} key={idx} selected={false} />
            ))}
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
