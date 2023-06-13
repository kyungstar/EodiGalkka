import {application, Request, Response} from "express";

import ResController from "../ResController";

import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";

import AdminService from "../../service/admin/AdminService";
import MailService from "../../service/mail/MailService";



class AdminController extends ResController {

    public adminJoin = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, [
                "loginId", "pwd", "email", "phoneNumber", "gender", "name", "userType"
            ]),
            DataChecker.stringArrCheck(res, req.body, [
                "address", "addressDetail", "nickName"
            ], false)
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
            nickName: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            let userJoinResult = await AdminService.Join(data.loginId, data.pwd, data.email, data.name, data.nickName, data.phoneNumber, data.gender
                , data.address, data.addressDetail, data.userType);

            await this.resultInterpreter(req, res, userJoinResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public adminLogin = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, [
                "loginId", "pwd"
            ])
        ) as {
            loginId: string,
            pwd: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            let userJoinResult = await AdminService.Login(data.loginId, data.pwd);

            await this.resultInterpreter(req, res, userJoinResult);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    public joinList = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);


        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ["userType"])
        ) as {
            userType: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            await AdminService.userJoinList(data.userType)

            await this.resultInterpreter(req, res, '01');

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

}


export default new AdminController();
