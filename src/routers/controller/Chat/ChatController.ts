

import Chat from "../../../models/Chat";
// import User from "../../../models/User";

import ResHandler from "../ResHandler";
import Logger from "../../../modules/Logger";
import DataValiator from "../../../service/DataValiator";
import {Request, Response} from "express";
import {
    chatMsgInterface,
    chatRoomInterface, chatRoomInviteSchema,
    chatRoomMemberSchema,
    chatRoomSchema, chatSendSchema,
    chatUserInterface,
    chatUserSchema
} from "../../../repositories/ChatEntity";

import ChatService from "../../../service/chat/ChatService";
import UserService from "../../../service/user/UserService";

import DBHelper from "../../../modules/DBHelper";


class ChatController extends ResHandler {

    // 메시지 저장, user any 수정 필요함
    public sendMsg = async (req: Request, res: Response) => {

        try {
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, chatSendSchema),
            ) as chatMsgInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const userData = await UserService.getLoginData({user_id: data.userId});

            if(!userData) {
                this.false("NU0", res);
                return;
            }

            const [msgRes, msgCode, msg] = await ChatService.sendMsg(data);

            if(!msgRes) {
                this.false(msgCode, res);
                return;
            }

            this.true(msgCode, res);

        } catch (err) {
            Logger.error(err.stack);
            return null;
        }
    }



    // === 채팅방 ===

    public createRoom = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, chatRoomSchema),
                DataValiator.checkString(["chatRoomName", "userIds"])
            ) as chatRoomInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [createRoomResult, roomCode, roomData] = await ChatService.createChatRoom(data);

            if (!createRoomResult) {
                this.false(roomCode, res);
                return;
            }

            this.true(roomCode, res);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public roomMember = async (req: Request, res: Response) => {

        try {

            Logger.info(JSON.stringify(req.body));

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, chatRoomMemberSchema),
                DataValiator.checkString(["chatRoomSeq"])
            ) as chatRoomInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [createRoomResult, roomCode, roomMemberList] = await ChatService.getRoomMember(data);

            if (!createRoomResult) {
                this.false(roomCode, res);
                return;
            }

            this.true(roomCode, res, roomMemberList);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


    public inviteMember = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, chatRoomInviteSchema),
                DataValiator.checkString(["chatRoomSeq", "userIds"])
            ) as chatRoomInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [inviteMemberResult, inviteCode] = await ChatService.inviteRoomMember(data);

            if (!inviteMemberResult) {
                this.false(inviteCode, res);
                return;
            }

            this.true(inviteCode, res);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public myRoom = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, chatUserSchema),
            ) as chatUserInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [myRoomResult, myRoomCode, myRoomList] = await ChatService.getMyRoom(data);

            if (!myRoomResult) {
                this.false(myRoomCode, res);
                return
            }

            this.true(myRoomCode, res, myRoomList);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    // ==========================================

}

export default new ChatController();