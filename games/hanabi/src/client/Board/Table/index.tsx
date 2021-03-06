import { StartedGame } from "@board-at-home/api/src";
import {
  faBomb,
  faInfoCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as _ from "lodash";
import * as React from "react";
import { Flex } from "theme-ui";
import { Colour, Config, HanabiNumber, State } from "../../../api";
import { CardDisplay } from "../Card";
import Tokens from "./Tokens";

const CARD_HEIGHT = "72px";

export default ({ game }: { game: StartedGame<State, Config> }) => {
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
              card={{
                colour,
                num: game.state.board.piles[colour] as HanabiNumber,
              }}
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
        <FontAwesomeIcon icon={faTrash} style={{ marginTop: "16px" }} />
      )}
      <Flex
        sx={{
          minHeight: CARD_HEIGHT,
          alignItems: "start",
        }}
        m={2}
      >
        {Object.values(game.state.board.discardPile).map((pile, pileIdx) => (
          <Flex
            sx={{
              flexDirection: "column",
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
