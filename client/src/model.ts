import { createModel } from "@prodo/core";
import localPlugin from "@prodo/local";
import loggerPlugin from "@prodo/logger";
import routePlugin from "@prodo/route";

export interface State {
  socket?: SocketIOClient.Socket;
  gameState?: any;
  serverMessage?: string;
}

export interface Local {
  userId: string;
}

export const model = createModel<State>()
  .with(localPlugin<Local>())
  .with(routePlugin)
  .with(loggerPlugin);

export const { state, dispatch, watch, local, route } = model.ctx;
