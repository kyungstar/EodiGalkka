import {application, Request, Response} from "express";

import ResController from "../ResController";

import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";

import AgencyService from "../../service/agency/AgencyService";



class AgencyController extends ResController {

    public agencyJoin = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body,
                ["gender", "name", "joinReason", "address", "addressDetail", "nickName"],
                ["loginId", "pwd", "email", "phoneNumber", "userType", "agencyName", "gender"])
        ) as {
            loginId: string,
            pwd: string,
            userType: string,
            email: string,
            phoneNumber: string,
            gender: string,
            address: string,
            addressDetail: string,
            name: string,
            nickName: string,
            agencyName: string,
            joinReason: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            let agencyJoinResult = await AgencyService.Join(data.loginId, data.pwd, data.email, data.name, data.nickName, data.phoneNumber, data.gender
                , data.address, data.addressDetail, data.userType, data.agencyName, data.joinReason);

            await this.resultInterpreter(req, res, agencyJoinResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public agencyLogin = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.stringCheck(res, req.body, [], ["loginId", "pwd"])
        ) as {
            loginId: string,
            pwd: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            let userJoinResult = await AgencyService.Login(data.loginId, data.pwd);

            await this.resultInterpreter(req, res, userJoinResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public userEmail = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.stringCheck(res, req.body, [],['email', 'userType'])
            ) as {
                email: string,
                userType: string
            }

            if (typeof data == 'string') {
                return this.clientReqError(req, res, data);
            }

            let emailCheckResult = await AgencyService.emailCheck(data.email, data.userType);

            await this.resultInterpreter(req, res, emailCheckResult);


        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    public userPhone = async (req: Request, res: Response) => {

        try {

            let data = DataChecker.mergeObject(
                DataChecker.stringCheck(res, req.body, [],['phoneNumber', 'userType'])
            ) as {
                phoneNumber: string,
                userType: string
            }

            if (typeof data == 'string') {
                await this.clientReqError(req, res, data);
            }

            let phoneCheckResult = await AgencyService.phoneCheck(data.phoneNumber, data.userType);

            await this.resultInterpreter(req, res, phoneCheckResult)


        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

}


export default new AgencyController();
