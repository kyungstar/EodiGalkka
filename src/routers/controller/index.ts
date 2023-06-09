import {Router} from "express";

// Config Load
import Config from '../../../config'


// 고객 서비스
import apiUSER from './User/index'
// 여행 서비스
import apiTOUR from './Tour/index'
// 관리자 및 여행투어사
import apiAgency from './Agency/index'
// 파일 관리
import apiFMS from './DFS/index'
// 채팅 서비스
import apiChat from './Chat/index'

const router = Router();


if (Config.SERVER_TYPE === "ADMIN") {
    router.use("/api/agency", apiAgency);
}

if (Config.SERVER_TYPE === "TOUR") {
    router.use("/api/tour", apiTOUR);
    router.use("/api", apiUSER);
}

if (Config.SERVER_TYPE === "CHAT") {
    router.use("/api/chat", apiChat);
}

if (Config.SERVER_TYPE === "FMS") {
    router.use("/api/file", apiFMS);
}

export default router;
