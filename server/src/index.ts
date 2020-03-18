import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as logger from "koa-logger";
import createRouter from "./routes";
import createSocketConnection from "./socket";
import * as http from "http";
import * as socket from "socket.io";
import newGameController from "./game-controller";

const PORT = process.env.PORT || 3000;

const app = new Koa();

app.use(bodyParser());
app.use(logger());

const gameController = newGameController();

const router = createRouter(gameController);
app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
const io = socket(server);
createSocketConnection(io, gameController);

server.listen(PORT, () => {
  console.log(`Started server on port ${PORT}`);
});
