import ResultBox from "../../dto/ResultBox";
import DB from "../../../modules/Mysql";
import QM from "../../../modules/QueryMaker";
import cheerio from "cheerio";
import chat from "../../controller/Chat";
import redisClient from "../../../modules/Redis";


export default class ChatService extends ResultBox {

    public static async createChatRoom(userId: string, targetUserId: string, roomName: string) {

        try {

            const alreadyRoomCheck = await DB.getOne(QM.Select("t_chat_room", {
                user_id: userId,
                receive_user_id: targetUserId
            }, {}, ["room_seq"]))

            if (alreadyRoomCheck)
                return this.JustFalse('AR0')

            let chatRoomSeq: number = await DB.getInsertId(QM.Insert("t_chat_room", {
                user_id: userId,
                receive_user_id: targetUserId,
                room_name: roomName
            }))

            if (chatRoomSeq > 0)
                return this.ObjTrue('WN0', [{chatRoomSeq: chatRoomSeq}]);
            else
                return this.JustFalse('WN0');

        } catch (err) {
            return this.JustErr(err);
        }
    }

    public static async deleteChatRoom(userId: string, roomSeq: number) {

        try {

            let targetRoomData = await DB.getOne(QM.Select("t_chat_room", {
                user_id: userId
            }, {}, ["room_seq"]));

            if (!targetRoomData)
                return this.JustFalse('WN0');


            let deleteRoomResult = await DB.Executer(QM.Delete("t_chat_room", {
                room_seq: roomSeq
            }))


            if (deleteRoomResult)
                return this.JustTrue('WN0');
            else
                return this.JustFalse('WN0');


        } catch (err) {
            return this.JustErr(err);
        }
    }

    public static async chatRoomList(userId: string) {

        try {

            const chatRoomList = await DB.getList(QM.Select("t_chat_room", {user_id: userId}, {}, ["*"]));

            if (chatRoomList)
                return this.ObjTrue('WN0', [{chatRoomList: chatRoomList}]);
            else
                return this.JustFalse('WN0');

        } catch (err) {
            return this.JustErr(err);
        }
    }


    public static async sendMsg() {

        try {

            //redisClient.


            if (true)
                return this.ObjTrue('WN0', [{itemList: true}]);
            else
                return this.JustFalse('WN0');

        } catch (err) {
            return this.JustErr(err);
        }
    }

    public static async receiveMsg() {

        try {


            if (true)
                return this.ObjTrue('WN0', [{itemList: true}]);
            else
                return this.JustFalse('WN0');

        } catch (err) {
            return this.JustErr(err);
        }
    }


}