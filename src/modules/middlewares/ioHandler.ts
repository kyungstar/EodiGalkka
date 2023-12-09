import { Server, Socket } from "socket.io";
import Logger from "./Logger";

export default function ioHandler(io: Server) {
    io.on("connection", async (socket: Socket) => {
        Logger.info("client is connected" + socket.id);

        socket.on("disconnect",()=> {
            Logger.info("user is disconnected");
        })
    });
}
