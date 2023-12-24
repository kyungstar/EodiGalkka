import Logger from "../../modules/Logger";

import {chatRoomInterface} from "../../repositories/ChatEntity";
import DBHelper from "../../modules/DBHelper";

export default class UserService {

    public static async createChatRoom(chatRoom: chatRoomInterface): Promise<[boolean, string, any?]> {

        try {

            const targetRoom = await DBHelper.Insert("chatting_room",{
                chat_room_name: chatRoom.chatRoomName,
                create_user_id: chatRoom.userId
            });

            if(!targetRoom) {
                return [false, "채팅방 생성에 실패하였습니다."];
            }

            return [true, "채팅방 생성에 성공하였습니다."];

        } catch (err) {
            Logger.error("createChatRoom " + err);
            return [false, "채팅방 생성에 실패하였습니다."];
        }
    }
}