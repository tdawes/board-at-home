/** @jsx jsx */
import * as React from "react";
import { Game, Player } from "@board-at-home/api/src";
import { jsx, Input, Flex, Heading, Divider, IconButton, Box } from "theme-ui";
import { dispatch } from "../model";
import { setPlayerName } from "../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

export interface Props {
  game: Game<any, any>;
  player: Player;
}

const PlayerName = ({ code, player }: { code: string; player: Player }) => {
  const [editing, setEditing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [tempValue, setTempValue] = React.useState(player.name || "");

  React.useEffect(() => {
    setLoading(false);
  }, [player.name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (editing) {
    const submit = () => {
      if (tempValue !== player.name) {
        dispatch(setPlayerName)(code, player.id, tempValue!);
        setLoading(true);
      }
      setEditing(false);
    };

    return (
      <Flex sx={{ alignItems: "center" }} ml={1}>
        <Input
          value={tempValue}
          onChange={e => setTempValue(e.target.value)}
          onKeyUp={e => {
            // Enter key
            if (e.keyCode === 13) {
              submit();
            }
          }}
        />
        <IconButton onClick={submit} ml={1}>
          <FontAwesomeIcon icon={faCheck} />
        </IconButton>
        <IconButton
          onClick={() => {
            setEditing(false);
            setTempValue(player.name || "");
          }}
          ml={1}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </Flex>
    );
  }

  return (
    <Flex sx={{ alignItems: "baseline", maxWidth: "50vw" }}>
      <Box
        sx={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        Player name: <b>{player.name || player.id}</b>
      </Box>
      <IconButton onClick={() => setEditing(true)} ml={1}>
        <FontAwesomeIcon icon={faEdit} />
      </IconButton>
    </Flex>
  );
};

export default ({ game, player }: Props) => (
  <div>
    <Flex
      sx={{
        width: "100%",
        height: "50px",
        justifyContent: "space-between",
        alignItems: "flex-end",
      }}
    >
      <Flex
        sx={{
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <Heading as="h1" mr={2}>
          {game.type}
        </Heading>
        code: {game.code}
      </Flex>
      <PlayerName code={game.code} player={player} />
    </Flex>
    <Divider mb={3} sx={{ borderColor: "black" }} />
  </div>
);
