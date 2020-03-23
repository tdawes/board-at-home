import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as logger from "koa-logger";
import * as serve from "koa-static";
import createRouter from "./routes";
import createSocketConnection from "./socket";
import * as http from "http";
import * as socket from "socket.io";
import newGameController from "./game-controller";
import * as path from "path";

const PORT = process.env.PORT || 3000;

const app = new Koa();

app.use(bodyParser());
app.use(logger());

const gameController = newGameController();

const router = createRouter(gameController);
app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.PUBLIC_DIR != null) {
  const publicDir = path.resolve(__dirname, process.env.PUBLIC_DIR);
  console.log(`Serving app from ${publicDir}.`)

  const www = serve(publicDir);
  // Serve built files
  app.use(www);
  // Serve index.html on other requests
  app.use(async (ctx, next) => {
    await www({ ...ctx, path: "index.html" }, next);
  });
}

const server = http.createServer(app.callback());
const io = socket(server);
createSocketConnection(io, gameController);

server.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});
