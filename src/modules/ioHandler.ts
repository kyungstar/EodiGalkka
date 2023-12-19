import { Server, Socket } from "socket.io";
import Logger from "./Logger";
import ChatController from "../routers/controller/Chat/ChatController";

export default function ioHandler(io: Server) {
    io.on("connection", async (socket: Socket) => {
        Logger.info("client is connected " + socket.id);

        socket.on("login", async (userName, cb)=> {
            Logger.info(userName);
            // 유저정보를 저장
            try {
                cb({result: true});
            } catch (err) {
                Logger.info(err.stack);
                cb({result: false});
            }

        });


        socket.on("sendMessage", async (message, cb)=> {

            try {

                // 메시지 저장
                const newMessage = await ChatController.saveChat(message, true);
                io.emit("message", newMessage);
            } catch (err) {
                Logger.info(err.stack);
                cb({result: false});
            }

        });


        socket.on("disconnect",()=> {
            Logger.info("user is disconnected");
        });
    });
}
