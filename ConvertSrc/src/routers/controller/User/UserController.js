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
const ResController_1 = __importDefault(require("../ResController"));
const Logger_1 = __importDefault(require("../../../modules/Logger"));
const DataChecker_1 = __importDefault(require("../../util/DataChecker"));
const UserService_1 = __importDefault(require("../../service/user/UserService"));
const MailService_1 = __importDefault(require("../../service/mail/MailService"));
const MqttExecuter_1 = __importDefault(require("../../service/mqtt/MqttExecuter"));
class UserController extends ResController_1.default {
    constructor() {
        super(...arguments);
        this.userAuth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ["authType", "authPwd"]), DataChecker_1.default.stringArrCheck(res, req.body, ["loginId", "email"], false));
            if (typeof data == 'string') {
                return this.clientReqError(req, res, data);
            }
            try {
                const userData = yield UserService_1.default.checkUserAuth(data.loginId, data.email, data.authType, data.authPwd);
                // MqttExecuter 클래스의 인스턴스 생성
                const mqttExecuter = new MqttExecuter_1.default();
                MqttExecuter_1.default.publishMessage('C/2/H/2', "hello");
                yield this.resultInterpreter(req, res, userData);
            }
            catch (err) {
                yield this.errInterpreter(req, res, err);
            }
        });
        this.sendAuth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.body, ["authType"], true), DataChecker_1.default.stringArrCheck(res, req.body, ["loginId", "email"], false));
            if (typeof data == 'string') {
                return this.clientReqError(req, res, data);
            }
            try {
                const mailResult = yield MailService_1.default.authEmail(data.authType, data.loginId, data.email);
                this.resultInterpreter(req, res, mailResult);
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
        this.userJoin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, [
                "loginId", "pwd", "userType", "email", "phoneNumber", "gender", "name"
            ]), DataChecker_1.default.stringArrCheck(res, req.body, [
                "address", "addressDetail", "nickName"
            ], false));
            try {
                if (typeof data == 'string') {
                    return this.clientReqError(req, res, data);
                }
                let userJoinResult = yield UserService_1.default.Join(data.loginId, data.pwd, data.userType, data.email, data.name, data.nickName, data.phoneNumber, data.gender, data.address, data.addressDetail);
                this.resultInterpreter(req, res, userJoinResult);
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
        this.userLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.body, ["loginId", "pwd"], true));
            if (typeof data == 'string') {
                return this.clientReqError(req, res, data);
            }
            try {
                let accessInfo = yield UserService_1.default.Access(res, data.loginId, data.pwd);
                this.resultInterpreter(req, res, accessInfo);
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
        this.userEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['email']));
                if (typeof data == 'string') {
                    return this.clientReqError(req, res, data);
                }
                let emailCheckResult = yield UserService_1.default.emailCheck(data.email);
                this.resultInterpreter(req, res, emailCheckResult);
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
        this.userPhone = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['phoneNumber']));
                if (typeof data == 'string') {
                    this.clientReqError(req, res, data);
                }
                let phoneCheckResult = yield UserService_1.default.phoneCheck(data.phoneNumber);
                this.resultInterpreter(req, res, phoneCheckResult);
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
        this.resetPw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['newPwd']), DataChecker_1.default.loadJWTValue(req.body));
                if (typeof data == 'string') {
                    return this.clientReqError(req, res, data);
                }
                let userPwdUpdate = yield UserService_1.default.updatePwd(data.userId, data.newPwd);
                this.resultInterpreter(req, res, userPwdUpdate);
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
        this.authPw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['loginId', 'pwd']));
                if (typeof data == 'string') {
                    return this.clientReqError(req, res, data);
                }
                let userPwdAuth = yield UserService_1.default.authPwd(data.loginId, data.pwd);
                this.resultInterpreter(req, res, userPwdAuth);
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['loginId']), DataChecker_1.default.stringArrCheck(res, req.body, ['email', 'phoneNumber', 'address', 'addressDetail'], false));
                if (typeof data == 'string') {
                    return this.clientReqError(req, res, data);
                }
            }
            catch (err) {
                this.errInterpreter(req, res, err);
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map