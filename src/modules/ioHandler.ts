import { Server, Socket } from "socket.io";
import Logger from "./Logger";
import ChatService from "../service/chat/ChatService";
import {chatMsgInterface} from "../repositories/ChatEntity";

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


        socket.on("sendMessage", async (userId, chatRoomSeq, message, cb)=> {

            try {

                let sendMsgModel: chatMsgInterface = {
                    userId: userId,
                    msg: message,
                    chatRoomSeq: chatRoomSeq // 채팅 방 번호
                };

                const newMessage = await ChatService.sendMsg(sendMsgModel);

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
