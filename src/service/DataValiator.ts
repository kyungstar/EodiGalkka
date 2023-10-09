import Ajv, { Schema } from 'ajv';
import { Request, Response } from 'express';
import Logger from '../modules/middlewares/Logger';

const ajv = new Ajv(); // Ajv 인스턴스 생성

class DataValidator {
    private req?: Request;
    private schema?: Schema;

    // req 설정 메서드 추가
    public setRequest(req: Request, schema: Schema) {
        this.req = req;
        this.schema = schema;
    }

    public initRequest(req: Request, schema: Schema) {

        Logger.info("Received API Call : " + req.originalUrl);
        Logger.info("Received Body : " + JSON.stringify(req.body));

        this.req = req;
        this.schema = schema;
    }

    private validate(schema: Schema, obj: any) {
        if (!this.req) {
            throw new Error('Request (req) is not set. Call setRequest() to set the request object.');
        }

        const validate = ajv.compile(schema); // 스키마를 사용하여 유효성 검사 함수 생성
        if (validate(obj)) {
            return true;
        } else {
            return validate.errors[0].message;
        }
    }

    public numberTypeCheck(numberArr: string[]) {

    }

    public stringArrCheck(strArr: string[]) {

        let retObj: { [key: string]: any } = {};

        for (let item of strArr) {
            if (this.req && this.req.body && this.req.body[item] !== undefined) {
                retObj[item] = this.req.body[item];
            }
        }

        return retObj;
    }

    public schemaCheck(...objList: any[]) {
        let obj = {};

        for (let item of objList) {
            if (typeof item === "string") {
                return item;
            }

            Object.assign(obj, item);
        }

        const targetObj = this.validate(this.schema, obj);

        if(targetObj === true)
            return obj;
        else
            return targetObj;

    }
}

export default new DataValidator();
