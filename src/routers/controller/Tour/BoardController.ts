import {application, Request, Response} from "express";
import axios from 'axios';

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";
import BoardService from "../../service/tour/board/BoardService";



class BoardController extends ResController {

    public boardWrite = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringArrCheck(res, req.body, ["boardType", "title", "contents"], true),
            DataChecker.stringArrCheck(res, req.body, ["fileList"], false),
            DataChecker.numberArrCheck(res, req.body, ["targetSeq"], 0,true)
        ) as {
            userId: string,
            fileList: string[],
            boardType: BoardType.TOUR,
            title: string,
            contents: string,
            targetSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardWriteResult = await BoardService.boardWrite(data.userId, data.boardType, data.targetSeq, data.title, data.contents, data.fileList);

            await this.resultInterpreter(req, res, boardWriteResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public boardUpdate = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringArrCheck(res, req.body, ["boardSeq", "boardType", "title", "contents"], true),
            DataChecker.stringArrCheck(res, req.body, ["fileList"], false),
            DataChecker.numberArrCheck(res, req.body, ["targetSeq"], 0,true)
        ) as {
            boardSeq: number,
            userId: string,
            fileList: string[],
            boardType: BoardType.TOUR,
            title: string,
            contents: string,
            targetSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardUpdateResult = await BoardService.boardUpdate(data.boardSeq, data.userId, data.boardType, data.targetSeq, data.title, data.contents, data.fileList);

            await this.resultInterpreter(req, res, boardUpdateResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public boardDelete = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringArrCheck(res, req.body, ["boardSeq"], true),
            DataChecker.stringArrCheck(res, req.body, [], false),
            DataChecker.numberArrCheck(res, req.body, [], 0,true)
        ) as {
            boardSeq: number,
            userId: string,
            fileList: string[],
            boardType: BoardType.TOUR,
            title: string,
            contents: string,
            targetSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardUpdateResult = await BoardService.boardUpdate(data.boardSeq, data.userId, data.boardType, data.targetSeq, data.title, data.contents, data.fileList);

            await this.resultInterpreter(req, res, boardUpdateResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

}

export default new BoardController();