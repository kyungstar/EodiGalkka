import express, {Response} from "express";

import Logger from "../../modules/Logger";
import {MyAuth} from "../../modules/SecurityAuth";


export default class ResHandler {


    validErr(res: express.Response) {

        const response = {
            success: false,
            message: MyAuth.getEncryptCode("데이터 검증에 실패하였습니다.")
        };

        Logger.debug("API Response : " + JSON.stringify({
            success: false,
            message: "데이터 검증에 실패하였습니다."
        }));

        return res.status(200).json(response);
    }


    false(code: string, res: express.Response) {

        const response = {
            success: false,
            message: MyAuth.getEncryptCode(code)
        };

        Logger.debug("API Response : " + JSON.stringify({
            success: false,
            message: code
        }));

        return res.status(200).json(response);

    }


    true(code: string, res: Response, targetObj?: any) {

        let response = {
            success: true,
            message: MyAuth.getEncryptCode(code)
        };

        if (targetObj) {
            response = {...targetObj, ...response};
        }

        Logger.debug("API Response : " + JSON.stringify({
            success: true,
            message: code,
            targetObj: targetObj
        }));

        return res.status(200).json(response);

    }


    err(err: any, res: express.Response) {

        Logger.error(err + ' is Occurred');

        const response = {
            success: false,
            err: err
        };

        return res.status(200).json(response);

    }


}