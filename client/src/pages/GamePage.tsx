/** @jsx jsx */
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import io from "socket.io-client";
import {
  Alert,
  Button,
  Close,
  Container,
  Flex,
  IconButton,
  jsx,
  Spinner,
} from "theme-ui";
import {
  applyPlayerAction,
  clearServerError,
  joinGame,
  kickPlayer,
  registerSocket,
  startGame,
} from "../actions";
import TopBar from "../components/TopBar";
import games from "../games";
import { dispatch, local, state, watch } from "../model";

export interface Props {
  code: string;
}

const ErrorMessage = ({
  message,
  onClose,
}: {
  message: string;
  onClose?: () => any;
}) => (
  <Alert variant="error">
    Error: {message}
    {onClose && <Close ml="auto" mr={-2} onClick={onClose} />}
  </Alert>
);

export default ({ code }: Props) => {
  React.useEffect(() => {
    const socket = io.connect();
    dispatch(registerSocket)(socket, dispatch);
    dispatch(joinGame)(code);

    return () => {
      socket.disconnect();
    };
  }, [code]);

  const game = watch(state.game);
  const userId = watch(local.userId)!;
  const serverMessage = watch(state.serverMessage);

  const [config, setConfig] = React.useState(null);

  React.useEffect(() => {
    if (game != null) {
      setConfig(games[game.type].defaultConfig(game));
    }
  }, [game && game.type]);

  if (game == null) {
    return (
      <Container p={3} sx={{ textAlign: "center" }}>
        {serverMessage && <ErrorMessage message={serverMessage} />}
        <Spinner />
      </Container>
    );
  }

  if (!(userId in game.players)) {
    return (
      <Container p={3}>
        You have been kicked from the game. Please refresh your page to rejoin.
      </Container>
    );
  }

  const { ConfigPanel, Board } = games[game.type];
  return (
    <Container p={3}>
      {serverMessage && (
        <ErrorMessage
          message={serverMessage}
          onClose={() => dispatch(clearServerError)()}
        />
      )}
      <TopBar game={game} player={game.players[userId]} />
      <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
        <div>
          Players:{" "}
          {Object.keys(game.players).map((playerId, idx) => (
            <span key={playerId}>
              {game.players[playerId].name || playerId}
              {!game.started && userId === game.owner && userId !== playerId && (
                <IconButton
                  sx={{ p: 2 }}
                  onClick={() => dispatch(kickPlayer)(code, playerId)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </IconButton>
              )}
              {idx < Object.keys(game.players).length - 1 && ", "}
            </span>
          ))}
        </div>
        {!game.started ? (
          userId === game.owner && (
            <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
              <ConfigPanel
                game={game}
                config={config || games[game.type].defaultConfig(game)}
                setConfig={(c: any) =>
                  setConfig({
                    ...(config || games[game.type].defaultConfig(game)),
                    ...c,
                  })
                }
              />
              <Button onClick={() => dispatch(startGame)(code, config)} mt={3}>
                Start game
              </Button>
            </Flex>
          )
        ) : (
          <Board
            playerId={userId}
            act={(action: any) =>
              dispatch(applyPlayerAction)(code, userId, action)
            }
            game={game}
          />
        )}
      </Flex>
    </Container>
  );
};
