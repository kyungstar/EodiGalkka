import {application, Request, Response} from "express";
import axios from 'axios';

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";



class BoardController extends ResController {

    public boardWrite = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, []),
            DataChecker.stringArrCheck(res, req.body, [], false)
        ) as {};

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            this.resultInterpreter(req, res, 'a');

        } catch (err) {
            this.errInterpreter(req, res, err);
        }

    }

}

export default new BoardController();