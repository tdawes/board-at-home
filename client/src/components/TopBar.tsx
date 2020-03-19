/** @jsx jsx */
import * as React from "react";
import { Game, Player } from "@board-at-home/api/src";
import { jsx, Button, Input, Flex } from "theme-ui";
import { dispatch } from "../model";
import { setPlayerName } from "../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

export interface Props {
  game: Game<any>;
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
        <Button onClick={submit} ml={1} mr={1}>
          <FontAwesomeIcon icon={faCheck} />
        </Button>
        <Button
          onClick={() => {
            setEditing(false);
            setTempValue(player.name || "");
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Flex>
    );
  }

  return (
    <Flex sx={{ alignItems: "center" }}>
      <div sx={{ m: 2 }}>{player.name}</div>
      <Button sx={{ p: 2 }} onClick={() => setEditing(true)}>
        <FontAwesomeIcon icon={faEdit} />
      </Button>
    </Flex>
  );
};

export default ({ game, player }: Props) => (
  <Flex
    sx={{
      width: "100%",
      height: "100px",
      justifyContent: "space-around",
      alignItems: "center",
    }}
  >
    <div>{game.type}</div>
    <div>Game Code: {game.code}</div>
    <Flex sx={{ m: 2, alignItems: "center" }}>
      Enter a name: <PlayerName code={game.code} player={player} />
    </Flex>
  </Flex>
);
