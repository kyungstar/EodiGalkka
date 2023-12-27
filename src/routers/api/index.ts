import {Router} from "express";
import UserRoutes from "./UserRoutes";
import FileRoutes from "./FileRoutes";
import TourRoutes from "./TourRoutes";
import ChatRoutes from "./ChatRoutes";
import Logger from "../../modules/Logger";

const SERVER_TYPE = process.argv[2];


const router = Router();


if(SERVER_TYPE.includes("USER")) {
    // 고객 서비스
    router.use("/api/user", UserRoutes);
    // 파일 서비스
    router.use("/api/file", FileRoutes);
    // 투어 서비스
    router.use("/api/tour", TourRoutes);
}

// 채팅 서비스
if(SERVER_TYPE.includes("CHAT")) {
    router.use("/api/chat", ChatRoutes);
}



export default router;

