import Logger from "../../modules/Logger";

import {chatRoomInterface, chatUserInterface} from "../../repositories/ChatEntity";
import DBHelper from "../../modules/DBHelper";

export default class UserService {

    public static async createChatRoom(chatRoom: chatRoomInterface): Promise<[boolean, string, any?]> {

        try {

            const targetRoom = await DBHelper.Insert("chat_room",{
                chat_room_name: chatRoom.chatRoomName,
                create_user_id: chatRoom.userId
            });

            if(!targetRoom) {
                return [false, "채팅방 생성에 실패하였습니다."];
            }

            const selfChatRoom = await DBHelper.Insert("chat_room_member",{
                chat_room_seq: targetRoom,
                user_id: chatRoom.userId
            });

            if(!targetRoom || !selfChatRoom) {
                await DBHelper.Delete("chatting_room",{chat_room_seq: targetRoom});
                return [false, "채팅방 생성에 실패하였습니다."];
            }

            return [true, "채팅방 생성에 성공하였습니다."];

        } catch (err) {
            Logger.error("createChatRoom " + err);
            return [false, "채팅방 생성에 실패하였습니다."];
        }
    }

    public static async getMyRoom(chatRoom: chatUserInterface): Promise<[boolean, string, any?]> {

        try {

            const myRoomList = await DBHelper.Join("INNER", "chat_room_member","chat_room",["chat_room_seq"], ""
                , {user_id: chatRoom.userId}, ["chat_room_seq"], ["chat_room_name"]);

            if(!myRoomList) {
                return [false, "채팅방 목록 조회에 실패하였습니다."];
            }

            return [true, "채팅방 목록", {myRoomList: myRoomList}];

        } catch (err) {
            Logger.error("getMyRoom " + err);
            return [false, "채팅방 생성에 실패하였습니다."];
        }
    }

    public static async getRoomMember(chatRoom: chatRoomInterface): Promise<[boolean, string, any?]> {

        try {

            const chatRoomMemberList = await DBHelper.Join("INNER",
                "chat_room_member","user",["user_id"], ""
                , {chat_room_seq: chatRoom.chatRoomSeq}, ["chat_room_seq", "user_id"], ["email", "phone_number"]);

            if(!chatRoomMemberList) {
                return [false, "채팅방 참여목록 조회에 실패하였습니다."];
            }

            return [true, "채팅방 참여목록", {myRoomList: chatRoomMemberList}];

        } catch (err) {
            Logger.error("getMyRoom " + err);
            return [false, "채팅방 생성에 실패하였습니다."];
        }
    }

    public static async inviteRoomMember(chatRoom: chatRoomInterface): Promise<[boolean, string, any?]> {

        try {

            // 이미 있는 사람이라면 제외한다.


        } catch (err) {
            Logger.error("getMyRoom " + err);
            return [false, "채팅방 생성에 실패하였습니다."];
        }
    }


}