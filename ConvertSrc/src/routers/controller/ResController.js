"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../../../src/modules/Logger"));
const MongoLogging_1 = __importDefault(require("../../middlewares/MongoLogging"));
class ResController {
    errInterpreter(req, res, err) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mongo Log
            res.locals.data = err;
            yield (0, MongoLogging_1.default)(req, res);
            try {
                Logger_1.default.error(err + ' Caused On Error');
                yield this.err(req, res, err);
            }
            catch (err) {
                yield this.err(req, res, err);
            }
        });
    }
    onlyResultInterpreter(apiResponse, type) {
        if (typeof apiResponse === 'object') {
            // 타입을 판단한다.
            // 해당 Class의 참, 거짓 유무를 판단하기 위해 사용한다.
            if (type === false) {
                if (apiResponse.result === false && type === false)
                    return true;
                else
                    return false;
            }
            else {
                if (apiResponse.result === true && type === true)
                    return true;
                else
                    return false;
            }
        }
        else {
            return false;
        }
    }
    resultInterpreter(req, res, apiResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mongo Log
            res.locals.data = apiResponse;
            yield (0, MongoLogging_1.default)(req, res);
            if (typeof apiResponse === 'object') {
                if (apiResponse.result === false)
                    return this.false(req, res, apiResponse);
                else
                    return this.true(req, res, apiResponse);
            }
            else {
                return this.false(req, res, apiResponse);
            }
        });
    }
    // T는 Type의 약자로 다른 언어에서도 제네릭을 선언할 때 관용적으로 많이 사용된다. 이 부분에는 식별자로 사용할 수 있는 것이라면 무엇이든 들어갈 수 있다.
    clientReqError(req, res, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let dto = {
                result: false,
                code: 'CUP',
                msg: msg
            };
            // Mongo Log
            res.locals.data = dto;
            yield (0, MongoLogging_1.default)(req, res);
            res.type('application/json');
            return res.status(200).json(dto);
        });
    }
    dataCheck(req, res, data, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let dto = {
                result: false,
                msg: data + msg
            };
            // Mongo Log
            res.locals.data = dto;
            yield (0, MongoLogging_1.default)(req, res);
            res.type('application/json');
            return res.status(200).json(dto);
        });
    }
    true(req, res, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dto) { // @ts-ignore
                dto = {};
            }
            // @ts-ignore
            dto.result = true;
            // Mongo Log
            res.locals.data = dto;
            yield (0, MongoLogging_1.default)(req, res);
            res.type('application/json');
            return res.status(200).json(dto);
        });
    }
    false(req, res, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dto) { // @ts-ignore
                dto = {};
            }
            // @ts-ignore
            dto.result = false;
            res.type('application/json');
            // Mongo Log
            res.locals.data = dto;
            yield (0, MongoLogging_1.default)(req, res);
            return res.status(200).json(dto);
        });
    }
    err(req, res, err) {
        return __awaiter(this, void 0, void 0, function* () {
            let dto = {
                result: false,
                code: '03',
                msg: 'Error Occurred By ' + err
            };
            Logger_1.default.error(err + ' is Occurred');
            // Mongo Log
            res.locals.data = dto;
            yield (0, MongoLogging_1.default)(req, res);
            res.type('application/json');
            return res.status(200).json(dto);
        });
    }
}
exports.default = ResController;
;
//# sourceMappingURL=ResController.js.map