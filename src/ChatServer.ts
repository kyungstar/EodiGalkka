
import {createServer} from "http";
import Config, {RUN_MODE} from "../config";

import {MONGO_SERVER} from "../config/Security";
import app from "../src/modules/middlewares/MongoLoader"
import ioHandler from "../src/modules/middlewares/ioHandler"
import {Server} from "socket.io";


const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin:`http://localhost:${MONGO_SERVER.WEB_PORT}`
    }
});

ioHandler(io);
httpServer.listen(MONGO_SERVER.PORT, () => {
    console.log(`[${RUN_MODE}] : Chat Server Listening on Port`, MONGO_SERVER.PORT);
})
