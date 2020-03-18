import { state, local, dispatch } from "./model";

export const registerSocket = (
  socket: SocketIOClient.Socket,
  dispatch: any,
) => {
  state.socket = socket;
  socket.on("disconnect", () => {
    dispatch(unregisterSocket)();
  });
  socket.on("update", (gameState: any) => {
    dispatch(setGameState)(gameState);
  });
  socket.on("error", (message: string) => {
    dispatch(setServerError)(message);
  });
};

export const unregisterSocket = () => {
  state.socket = undefined;
};

export const setServerError = (message: string) => {
  state.serverMessage = message;
};

export const setGameState = (gameState: any) => {
  state.gameState = gameState;
};

export const joinGame = (code: string) => {
  if (state.socket) {
    state.socket.emit("join game", { code, playerId: local.userId! });

    state.socket.on("update", (gameState: any) => {
      console.log("Received update", gameState);
      dispatch(setGameState)(gameState);
    });
  }
};
