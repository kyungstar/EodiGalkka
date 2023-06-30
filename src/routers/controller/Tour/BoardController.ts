import {application, Request, Response} from "express";
import axios from 'axios';

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";
import BoardService from "../../service/tour/board/BoardService";



class BoardController extends ResController {


    public boardDetail = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [],["boardSeq"]),
            DataChecker.loadJWTValue(req.body)
        ) as {
            boardSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardDetailData = await BoardService.boardDetail(data.boardSeq);

            await this.resultInterpreter(req, res, boardDetailData);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public boardList = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body, [],["boardType"]),
            DataChecker.numberCheck(res, req.body, ["page"],[], 0)
        ) as {
            boardType: string,
            page: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardListResult = await BoardService.boardList(data.boardType, data.page);

            await this.resultInterpreter(req, res, boardListResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public boardWrite = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body, ["fileList","contents"], ["boardType", "title"]),
            DataChecker.numberCheck(res, req.body, [], ["targetSeq"]),
            DataChecker.loadJWTValue(req.body)

        ) as {
            userId: string,
            fileList: string[],
            boardType: string,
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
            DataChecker.numberCheck(res, req.body, [], ["boardSeq", "targetSeq"]),
            DataChecker.stringCheck(res, req.body, ["contents", "fileList"], ["boardType","title"]),
        ) as {
            boardSeq: number,
            userId: string,
            fileList: string[],
            boardType: string,
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
            DataChecker.numberCheck(res, req.body, [], ["boardSeq"]),
            DataChecker.stringCheck(res, req.body, ["fileList"], []),
            DataChecker.loadJWTValue(req.body)
        ) as {
            boardSeq: number,
            userId: string,
            fileList: string[]
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardUpdateResult = await BoardService.boardDelete(data.boardSeq, data.userId, data.fileList);

            await this.resultInterpreter(req, res, boardUpdateResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public boardLike = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [], ["boardSeq"]),
            DataChecker.loadJWTValue(req.body)
        ) as {
            boardSeq: number,
            userId: string,
            fileList: string[]
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardLikeResult = await BoardService.boardLike(data.boardSeq, data.userId);

            await this.resultInterpreter(req, res, boardLikeResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public boardReply = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [], ["boardSeq"]),
            DataChecker.stringCheck(res, req.body, [], ["reply"]),
            DataChecker.loadJWTValue(req.body)
        ) as {
            boardSeq: number,
            userId: string,
            reply: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardReplyResult = await BoardService.boardReply(data.boardSeq, data.userId, data.reply);

            await this.resultInterpreter(req, res, boardReplyResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public boardReport = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [], ["boardSeq"]),
            DataChecker.stringCheck(res, req.body, ["reportContents", "fileList"], ["boardType"]),
            DataChecker.loadJWTValue(req.body)
        ) as {
            boardSeq: number,
            boardType: string,
            userId: string,
            reportContents: string,
            fileList: string[]
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const boardReplyResult = await BoardService.boardReport(data.boardSeq, data.boardType, data.userId, data.reportContents, data.fileList);

            await this.resultInterpreter(req, res, boardReplyResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

}

export default new BoardController();