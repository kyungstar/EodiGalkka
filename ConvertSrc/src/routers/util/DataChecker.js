"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created By 강영규 On 2022-11-13
 */
const ResController_1 = __importDefault(require("../Controller/ResController"));
class DataChecker extends ResController_1.default {
    // 토큰 꺼내기
    /*    public loadJWTValue(objData: any) {
            return {
                userId: objData.userId,
                userType: objData.userType
            }
        }
    
        // 토큰 관리자 검증하기
        public loadJWTAdminCheck(res: any, objData: any) {
    
            if(objData.userType !== 'ADMIN')
                return this.false(res, 'A01')
        }
    
    
        // 토큰 사용자 검증하기
        public loadJWTUserCheck(res: any, objData: any) {
            if(objData.userType !== 'USER' && objData.userType !== 'ADMIN')
                return this.false(res, 'U01');
        }*/
    // 필수 값 검증
    needArrCheck(res, objData, needArr) {
        let retObj = {};
        let dataFailList = [];
        for (let item of needArr) {
            if (objData[item] === undefined || objData[item] === "") {
                dataFailList.push(item);
            }
            // @ts-ignore
            retObj[item] = objData[item];
        }
        if (dataFailList.length > 0) {
            return dataFailList + ' Is Essential Data';
        }
        return retObj;
    }
    numberArrCheck(res, objData, numberArr, isRequire) {
        let retObj = {};
        for (let item of numberArr) {
            if ((item == '' || item == undefined) && isRequire === true) {
                return this.dataCheck(res, item, '  Is Essential Data');
            }
            // @ts-ignore
            retObj[item] = parseInt(objData[item]);
        }
        return retObj;
    }
    stringArrCheck(res, objData, strArr, isRequire) {
        let retObj = {};
        for (let item of strArr) {
            if ((item == '' || item == undefined) && isRequire === true) {
                return this.dataCheck(res, item, '  Is Essential Data');
            }
            // @ts-ignore
            retObj[item] = objData[item];
        }
        return retObj;
    }
    mergeObject(...objList) {
        let obj = {};
        for (let item of objList) {
            if (typeof item === "string") {
                return item;
            }
            Object.assign(obj, item);
        }
        return obj;
    }
}
exports.default = new DataChecker();
//# sourceMappingURL=DataChecker.js.map