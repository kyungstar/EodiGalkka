import {Router} from "express";

import Config from '../../../config'
import apiUSER from '../../routers/controller/User/index'
import apiTOUR from '../../routers/controller/Tour/index'

const router = Router();


if (Config.SERVER_TYPE === "USER") {
    router.use("/api", apiUSER);
}

if (Config.SERVER_TYPE === "TOUR") {
    router.use("/api/tour", apiTOUR);
}

export default router;
