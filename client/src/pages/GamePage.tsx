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
} from "../actions";
import { jsx, Button } from "theme-ui";
import games from "../games";
import TopBar from "../components/TopBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface Props {
  code: string;
}

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

  const [config, setConfig] = React.useState(null);

  React.useEffect(() => {
    if (game != null) {
      setConfig(games[game.type].defaultConfig);
    }
  }, [game && game.type]);

  if (game == null) {
    return <div>Loading...</div>;
  }

  if (!(userId in game.players)) {
    return (
      <div>
        You have been kicked from the game. Please refresh your page to rejoin.
      </div>
    );
  }

  const { ConfigPanel, Board } = games[game.type];
  return (
    <div>
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
    </div>
  );
};
