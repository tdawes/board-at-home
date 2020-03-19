/** @jsx jsx */
import * as React from "react";
import io from "socket.io-client";
import { dispatch, watch, state, local } from "../model";
import {
  registerSocket,
  joinGame,
  startGame,
  applyPlayerAction,
  kickPlayer,
  clearServerError,
} from "../actions";
import { jsx, Alert, Container, Button, Close } from "theme-ui";
import games from "../games";
import TopBar from "../components/TopBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

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
      setConfig(games[game.type].defaultConfig);
    }
  }, [game && game.type]);

  if (game == null) {
    return (
      <Container p={3}>
        {serverMessage && <ErrorMessage message={serverMessage} />}
        Loading...
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
      <p>Welcome to game {code}.</p>
      <div>
        Players:
        <ul>
          {Object.keys(game.players).map(playerId => (
            <li key={playerId}>
              {game.players[playerId].name || playerId}
              {userId === game.owner && userId !== playerId && (
                <Button
                  sx={{ p: 2 }}
                  onClick={() => dispatch(kickPlayer)(code, playerId)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </Button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {!game.started ? (
        userId === game.owner && (
          <div>
            <ConfigPanel
              config={config || games[game.type].defaultConfig}
              setConfig={(c: any) =>
                setConfig({
                  ...(config || games[game.type].defaultConfig),
                  ...c,
                })
              }
            />
            <Button onClick={() => dispatch(startGame)(code, config)}>
              Start
            </Button>
          </div>
        )
      ) : (
        <Board
          playerId={userId}
          act={action => dispatch(applyPlayerAction)(code, userId, action)}
          game={game}
        />
      )}
    </Container>
  );
};
