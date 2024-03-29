import {Router} from "express";

import {JwtCheck} from "../../modules/SecurityAuth"
import ChatController from "../controller/Chat/ChatController";


const router: Router = Router();

// 채팅방 생성
router.post("/room/create", [JwtCheck], ChatController.createRoom);

// 나의 채팅방 목록
router.post("/my/room", [JwtCheck], ChatController.myRoom);

// 채팅방 참여 목록
router.post("/room/member", [JwtCheck], ChatController.roomMember);

// 채팅방 초대하기
router.post("/member/invite", [JwtCheck], ChatController.inviteMember);

// 메시지 발송하기
// > API Test 용으로, 실제는 Socket on message로 이루어짐
router.post("/send/msg", [JwtCheck], ChatController.sendMsg);



export default router;