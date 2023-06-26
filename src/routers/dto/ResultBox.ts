import {token} from "morgan";
import Logger from "../../modules/Logger";
import express from "express";


export default class ResultBox {


    static JustFalse(code: string) {

        let dto = {
            result: false,
            code: code
        };

        return dto;
    }

    static JustTrue(code: string) {

        let dto = {
            result: true,
            code: code
        };

        return dto;

    }

    static ObjTrue(code: string, targetObj: object[]) {

        let dto = {
            result: true,
            code: code,
        };

        let resultObj;

        resultObj = Object.assign({}, targetObj[0], dto);


        return resultObj;

    }

    static JustErr(err: string) {

        if (typeof err === "string")
            err = err.substring(0, 10);

        Logger.debug(err + ' is Occured');
        return {result: false, code: '03', err: err + ' is Occurred'};
    }


}