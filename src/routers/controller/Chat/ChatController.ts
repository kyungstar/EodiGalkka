import UserService from "../../../service/user/UserService";

import Chat from "../../../models/Chat";
// import User from "../../../models/User";

import ResHandler from "../ResHandler";
import Logger from "../../../modules/Logger";
import DataValiator from "../../../service/DataValiator";
import {Request, Response} from "express";
import {chatRoomInterface, chatRoomSchema} from "../../../repositories/ChatEntity";
import ChatService from "../../../service/chat/ChatService";
import DBHelper from "../../../modules/DBHelper";


class ChatController extends ResHandler {

    // 메시지 저장, user any 수정 필요함
    public saveChat = async (message: string, user: any) => {

        try {

            if (!user)
                return null;

            const newMessage = new Chat({
                chat: message,
                user: {
                    id: user._id,
                    name: user.name
                }
            });

            await newMessage.save();
            return newMessage;

        } catch (err) {
            Logger.error(err.stack);
            return null;
        }
    }

    /*  public checkUser = async (sid: string) => {

          try {
              /!*const user = await User.findOne({token: sid});

              if(!user)
                  return null;

              return user;*!/

          } catch (err) {
              Logger.error(err.stack);
              return null;
          }
      }
  */

    // === 채팅방 ===

    public createRoom = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, chatRoomSchema),
                DataValiator.checkString(["chatRoomName"])
            ) as chatRoomInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [createRoomResult, roomCode, roomData] = await ChatService.createChatRoom(data);

            if (!createRoomResult)
                this.false(roomCode, res);

            this.true(roomCode, res);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public roomMember = async (req: Request, res: Response) => {

        try {



        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


    public inviteMember = async (req: Request, res: Response) => {

        try {

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public myRoom = async (req: Request, res: Response) => {

        try {

            const userData = await DBHelper.findOne("user", {phoneNumber: "5310eaf312e8b5b426f090efde0a9252"})

            Logger.info(JSON.stringify(userData));

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    // ==========================================

}

export default new ChatController();