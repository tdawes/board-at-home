import { state, local } from "./model";
import { Dispatch } from "@prodo/core/lib/types";

export const registerSocket = (
  socket: SocketIOClient.Socket,
  dispatch: Dispatch,
) => {
  state.socket = socket;
  socket.on("disconnect", () => {
    dispatch(unregisterSocket)();
  });
  socket.on("update", (game: any) => {
    dispatch(setGame)(game);
    dispatch(clearServerError)();
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

export const clearServerError = () => {
  state.serverMessage = undefined;
};

export const setGame = (game: any) => {
  state.game = game;
};

export const joinGame = (code: string) => {
  if (state.socket) {
    state.socket.emit("join game", { code, playerId: local.userId! });
  }
};

export const kickPlayer = (code: string, playerId: string) => {
  if (state.socket) {
    state.socket.emit("kick player", { code, playerId });
  }
};

export const startGame = (code: string, config: any) => {
  if (state.socket) {
    state.socket.emit("start game", { code, config });
  }
};

export const applyPlayerAction = (
  code: string,
  playerId: string,
  action: any,
) => {
  if (state.socket) {
    state.socket.emit("action", { code, playerId, action });
  }
};

export const setPlayerName = (code: string, playerId: string, name: string) => {
  if (state.socket) {
    state.socket.emit("set player name", { code, playerId, name });
  }
};
