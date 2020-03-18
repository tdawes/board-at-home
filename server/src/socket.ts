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
  });
};
