import {Router} from "express";
import Config from "../../../../config";

import ChatController from './ChatController'
import {jwtAuthCheck} from "../../../middlewares/JwtAuth";

const router = Router();



// 채팅방 생성
router.post("/create/room", [jwtAuthCheck], ChatController.createChatRoom);
// 채팅방 삭제
router.post("/delete/room", [jwtAuthCheck], ChatController.deleteChatRoom);
// 채팅방 조회
router.post("/room/list", [jwtAuthCheck], ChatController.chatRoomList);


// 메시지 발송
router.post("/send/msg", [jwtAuthCheck], ChatController.sendMsg);
// 메시지 수신
router.post("/receive/msg", ChatController.receiveMsg);






export default router;