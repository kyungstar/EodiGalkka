import {Router} from "express";

import Config from '../../../config'

// 고객 서비스
import apiUSER from './User/index'

// 여행 서비스
import apiTOUR from './Tour/index'

// 관리자 및 여행투어사
import apiAdmin from './Admin/index'
import apiAgency from './Agency/index'

const router = Router();


if (Config.SERVER_TYPE === "USER") {
    router.use("/api", apiUSER);
}

if (Config.SERVER_TYPE === "ADMIN") {
    router.use("/api/admin", apiAdmin);
    router.use("/api/agency", apiAgency);
}

if (Config.SERVER_TYPE === "TOUR") {
    router.use("/api/tour", apiTOUR);
}

export default router;
