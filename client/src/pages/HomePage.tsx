import * as React from "react";
import { Select, Input, Button, Container, Flex, Divider } from "theme-ui";
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

const HomePageButton = ({
  text,
  disabled,
  onClick,
}: {
  text: string;
  disabled: boolean;
  onClick: () => any;
}) => (
  <Button
    disabled={disabled}
    variant={disabled ? "disabled" : "primary"}
    onClick={onClick}
    sx={{ width: "110px" }}
  >
    {text}
  </Button>
);

const CreateNewGame = () => {
  const [gameType, setGameType] = React.useState<string | undefined>(
    Object.keys(games)[0],
  );
  const userId = watch(local.userId)!;
  return (
    <Flex sx={{ justifyContent: "space-between" }}>
      <Select
        value={gameType}
        onChange={e => setGameType(e.target.value)}
        placeholder="Select a game"
        sx={{ width: "200px" }}
      >
        {Object.keys(games).map(game => (
          <option key={game}>{game}</option>
        ))}
      </Select>
      <HomePageButton
        text="New game"
        disabled={gameType == null}
        onClick={() => dispatch(createNewGame)(gameType!, userId)}
      />
    </Flex>
  );
};

const JoinGame = () => {
  const [code, setCode] = React.useState("");
  return (
    <Flex sx={{ justifyContent: "space-between" }}>
      <Input
        onChange={e => setCode(e.target.value)}
        value={code}
        placeholder="Enter code to join game"
        sx={{ width: "200px" }}
      />
      <HomePageButton
        text="Join game"
        disabled={code.length !== 4}
        onClick={() => dispatch(joinGame)(code)}
      />
    </Flex>
  );
};

export default () => {
  return (
    <Container p={3} sx={{ width: "360px", textAlign: "center" }}>
      <CreateNewGame />
      <Divider my={3} />
      <JoinGame />
    </Container>
  );
};
