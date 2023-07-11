import {application, Request, Response} from "express";

import ResController from "../ResController";

import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";
import ChatService from "../../service/chat/ChatService";


class ChatController extends ResController {

    public createChatRoom = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.loadJWTValue(req.body),
            DataChecker.stringCheck(res, req.body, [], ['targetUserId', 'roomName'])
        ) as {
            userId: string,
            targetUserId: string,
            roomName: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            let createChatRoomResult = await ChatService.createChatRoom(data.userId, data.targetUserId, data.roomName);

            await this.resultInterpreter(req, res, createChatRoomResult);


        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public deleteChatRoom = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.loadJWTValue(res),
            DataChecker.numberCheck(res, req.body, [], ['roomSeq'])
        ) as {
            userId: string,
            roomSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {


            let agencyJoinResult = await ChatService.deleteChatRoom(data.userId, data.roomSeq);

            await this.resultInterpreter(req, res, agencyJoinResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public chatRoomList = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.loadJWTValue(req.body)
        ) as {
            userId: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {


            let agencyJoinResult = await ChatService.chatRoomList(data.userId);

            await this.resultInterpreter(req, res, agencyJoinResult);


        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public sendMsg = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body, [], [])
        ) as {};

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {
            /*

                        let agencyJoinResult = await AgencyService.Join(data.loginId, data.pwd, data.email, data.name, data.nickName, data.phoneNumber, data.gender
                            , data.address, data.addressDetail, data.userType, data.agencyName, data.joinReason);

                        await this.resultInterpreter(req, res, agencyJoinResult);
            */

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public receiveMsg = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body, [], [])
        ) as {};

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {
            /*

                        let agencyJoinResult = await AgencyService.Join(data.loginId, data.pwd, data.email, data.name, data.nickName, data.phoneNumber, data.gender
                            , data.address, data.addressDetail, data.userType, data.agencyName, data.joinReason);

                        await this.resultInterpreter(req, res, agencyJoinResult);
            */

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

}


export default new ChatController();
