import * as React from "react";
import { Select, Input, Button, Container } from "theme-ui";
import axios from "axios";
import { watch, local, dispatch } from "../model";
import { push } from "@prodo/route";
import games from "../games";

const createNewGame = async (gameType: string, userId: string) => {
  const response = await axios.post("/api/game", {
    type: gameType,
    owner: userId,
  });
  const code = response.data;

  dispatch(push)({ path: `/game/${code}` });
};

const joinGame = (code: string) => {
  dispatch(push)({ path: `/game/${code}` });
};

const CreateNewGame = () => {
  const [gameType, setGameType] = React.useState<string | undefined>(
    Object.keys(games)[0],
  );
  const userId = watch(local.userId)!;
  return (
    <div>
      <label>Select a game:</label>
      <Select value={gameType} onChange={e => setGameType(e.target.value)} >
        {Object.keys(games).map(game => (
          <option key={game}>{game}</option>
        ))}
      </Select>
      <Button
        disabled={gameType == null}
        variant={gameType == null ? "disabled" : "primary"}
        onClick={() => dispatch(createNewGame)(gameType!, userId)}
      >
        New Game
      </Button>
    </div>
  );
};

const JoinGame = () => {
  const [code, setCode] = React.useState("");
  return (
    <div>
      <label>Enter code:</label>
      <Input onChange={e => setCode(e.target.value)} value={code} />
      <Button
        disabled={code.length !== 4}
        variant={code.length !== 4 ? "disabled" : "primary"}
        onClick={() => dispatch(joinGame)(code)}
      >
        Join
      </Button>
    </div>
  );
};

export default () => {
  return (
    <Container>
      <CreateNewGame />
      <p>or</p>
      <JoinGame />
    </Container>
  );
};
