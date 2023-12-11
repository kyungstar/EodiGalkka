import Ajv, {Schema} from 'ajv';
import {Request, Response} from 'express';
import Logger from '../modules/Logger';

const ajv = new Ajv();

class DataValidator {
    private req?: Request;
    private res?: Response;
    private schema?: Schema;

    public initRequest(req: Request, res: Response, schema: Schema) {

        Logger.info("Received API Call : " + req.originalUrl);
        Logger.info("Received Body : " + JSON.stringify(req.body));

        this.req = req;
        this.res = res;
        this.schema = schema;

        return true;
    }

    private checkValidate(schema: Schema, obj: any) {
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


    // number 추가 작업 진행해야함
    public checkNumber(numberArr: string[]) {
        //let retObj: { [key: string]: any } = {};
        let retObj: Record<string, any> = {};

        for (let item of numberArr) {
            if (this.req.method === "GET") {
                if (this.req && this.req.query && this.req.query[item] !== undefined) {
                    retObj[item] = Number(this.req.query[item]);
                }
            } else {
                if (this.req && this.req.body && this.req.body[item] !== undefined) {
                    retObj[item] = Number(this.req.body[item]);
                }
            }

        }

        return retObj;
    }

    public checkString(strArr: string[]) {

        //let retObj: { [key: string]: any } = {};
        let retObj: Record<string, any> = {};

        for (let item of strArr) {
            if (this.req.method === "GET") {
                if (this.req && this.req.query && this.req.query[item] !== undefined) {
                    retObj[item] = this.req.query[item];
                }
            } else {
                if (this.req && this.req.body && this.req.body[item] !== undefined) {
                    retObj[item] = this.req.body[item];
                }
            }
        }

        return retObj;
    }

    public checkSchema<T>(...objList: any[]) {

        let obj = {};

        for (let item of objList) {
            if (typeof item === "string") {
                return item;
            }

            Object.assign(obj, item);
        }

        Object.assign(obj, this.req.body);

        return obj;

    }


    public checkResult<T>(objList: object) {

        const targetObj = this.checkValidate(this.schema, objList);

        if (targetObj === true)
            return true;

        Logger.error(targetObj);
        return false;

    }

}

export default new DataValidator();
