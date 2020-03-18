import * as Router from "koa-router";
import { GameController } from "./game-controller";

export default (gameController: GameController) => {
  const router = new Router();

  router.post("/api/game", async (ctx, next) => {
    await next();
    const { type, owner } = ctx.request.body;
    const code = gameController.newGame(type, owner);
    ctx.body = code;
  });

  router.get("/api/games", async (ctx, next) => {
    await next();

    ctx.body = gameController.listGames();
  });

  return router;
};
