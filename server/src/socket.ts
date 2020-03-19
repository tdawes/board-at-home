import * as socket from "socket.io";
import { GameController } from "./game-controller";

const logger = {
  log: (message: string, ...args: any[]) => console.log(message, ...args),
};
export default (io: socket.Server, gameController: GameController) => {
  io.on("connection", socket => {
    logger.log("connection");
    const updateGame = (code: string, update: () => void) => {
      try {
        update();
        io.to(code).emit("update", gameController.getGame(code));
      } catch (e) {
        io.to(code).emit("error", e.message);
      }
    };

    socket.on(
      "join game",
      ({ code, playerId }: { code: string; playerId: string }) => {
        logger.log("join game", code, playerId);

        socket.join(code);
        updateGame(code, () => {
          gameController.joinGame(code, playerId);
        });
      },
    );

    socket.on(
      "kick player",
      ({ code, playerId }: { code: string; playerId: string }) => {
        logger.log("kick player", code, playerId);

        updateGame(code, () => {
          gameController.kickPlayer(code, playerId);
        });
      },
    );

    socket.on(
      "set player name",
      ({
        code,
        playerId,
        name,
      }: {
        code: string;
        playerId: string;
        name: string;
      }) => {
        logger.log("set player name", code, playerId, name);

        updateGame(code, () => {
          gameController.setPlayerName(code, playerId, name);
        });
      },
    );

    socket.on(
      "start game",
      ({ code, config }: { code: string; config: any }) => {
        logger.log("start game", code, config);

        updateGame(code, () => {
          gameController.startGame(code, config);
        });
      },
    );

    socket.on(
      "action",
      ({
        code,
        playerId,
        action,
      }: {
        code: string;
        playerId: string;
        action: any;
      }) => {
        logger.log("action", playerId, action);

        updateGame(code, () => {
          gameController.applyPlayerAction(code, playerId, action);
        });
      },
    );
  });
};
