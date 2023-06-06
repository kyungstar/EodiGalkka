"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../../modules/Logger"));
class ResultBox {
    static JustFalse(code) {
        let dto = {
            result: false,
            code: code
        };
        return dto;
    }
    static JustTrue(code) {
        let dto = {
            result: true,
            code: code
        };
        return dto;
    }
    static ObjTrue(code, targetObj) {
        let dto = {
            result: true,
            code: code,
        };
        let resultObj;
        if (targetObj.length === 1)
            resultObj = Object.assign({}, targetObj[0], dto);
        else
            resultObj = Object.assign({}, targetObj, dto);
        return resultObj;
    }
    /*    static JustTrue(res, code: string) {
            if (!dto) { // @ts-ignore
                dto = {};
            }
    
            // @ts-ignore
            dto.result = true;
            // @ts-ignore
            dto.code = code;
    
            res.type('application/json');
    
            return res.status(200).json(dto);
        }*/
    static JustErr(err) {
        err = err.substring(0, 10);
        Logger_1.default.debug(err + ' is Occured');
        return { result: false, code: '03', err: err + ' is Occurred' };
    }
}
exports.default = ResultBox;
//# sourceMappingURL=ResultBox.js.map