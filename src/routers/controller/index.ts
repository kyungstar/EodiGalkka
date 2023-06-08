import {Router} from "express";

import Config from '../../../config'
import apiUSER from './User/index'
import apiTOUR from './Tour/index'

const router = Router();


if (Config.SERVER_TYPE === "USER") {
    router.use("/api", apiUSER);
}

if (Config.SERVER_TYPE === "TOUR") {
    router.use("/api/tour", apiTOUR);
}

export default router;
