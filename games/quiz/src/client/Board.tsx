import { BoardProps } from "@board-at-home/api";
import * as React from "react";
import { Box, Button, Flex, Input } from "theme-ui";
import { Action, Config, State } from "../api";

const ResultsView = (props: BoardProps<State, Action, Config>) => (
  <Flex sx={{ flexDirection: "column" }}>
    {Object.keys(props.game.state.answers).map(player => (
      <Box key={player} m={2}>
        {props.game.players[player].name || player}:{" "}
        {props.game.state.answers[player] || "No answer given."}
      </Box>
    ))}
    {props.playerId === props.game.config.quizMaster && (
      <Button onClick={() => props.act({ type: "clear" })}>Clear</Button>
    )}
  </Flex>
);

const AnswerView = (props: BoardProps<State, Action, Config>) => {
  const [answer, setAnswer] = React.useState("");

  if (props.game.state.answers[props.playerId] != null) {
    return <Box>You answered: {props.game.state.answers[props.playerId]}.</Box>;
  }

  return (
    <Box>
      Answer:{" "}
      <Input
        onKeyUp={e => {
          // Enter key
          if (e.keyCode === 13) {
            props.act({ type: "submit", answer });
          }
        }}
        onChange={e => setAnswer(e.target.value)}
        value={answer}
      />
      <Button onClick={() => props.act({ type: "submit", answer })}>
        Submit
      </Button>
    </Box>
  );
};

const PlayerView = (props: BoardProps<State, Action, Config>) =>
  props.game.state.locked ? (
    <ResultsView {...props} />
  ) : (
    <AnswerView {...props} />
  );

const QuizMasterView = (props: BoardProps<State, Action, Config>) =>
  props.game.state.locked ? (
    <ResultsView {...props} />
  ) : (
    <Flex sx={{ flexDirection: "column" }}>
      {props.game.state.playerOrder.map(player => (
        <Box key={player} m={2}>
          {props.game.players[player].name || player}:{" "}
          {player in props.game.state.answers
            ? props.game.state.answers[player]
            : "No answer given."}
        </Box>
      ))}
      <Button onClick={() => props.act({ type: "lock-in" })}>Lock In</Button>
    </Flex>
  );

export default (props: BoardProps<State, Action, Config>) =>
  props.playerId === props.game.config.quizMaster ? (
    <QuizMasterView {...props} />
  ) : (
    <PlayerView {...props} />
  );
