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
class UserController extends ResController_1.default {
    constructor() {
        super(...arguments);
        this.userAuth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, [
                "loginId", "authType", "authPwd"
            ]));
            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }
            try {
                const userData = yield UserService_1.default.checkUserAuth(data.loginId, data.authType, data.authPwd);
                if (userData)
                    this.true(res, 'AS0');
                else
                    this.false(res, 'AF0');
            }
            catch (err) {
            }
        });
        this.sendAuth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.body, [
                "loginId", "authType"
            ], true));
            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }
            const userData = yield UserService_1.default.getUserData(data.loginId);
            if (!userData) {
                this.false(res, '01');
                return;
            }
            const userAuthData = yield UserService_1.default.getUserAuthData(data.loginId, data.authType);
            if (!userAuthData) {
                this.false(res, '01');
                return;
            }
            const mailResult = yield MailService_1.default.authEmail(userData.email, data.authType, userAuthData.cotents);
            if (mailResult.accepted[0].includes(userData.email))
                this.true(res, 'UA0');
            else
                this.false(res, 'UA1');
        });
        this.userJoin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, [
                "loginId", "pwd", "userType", "email", "phoneNumber", "gender", "name"
            ]), DataChecker_1.default.stringArrCheck(res, req.body, [
                "address", "addressDetail", "nickName"
            ], false));
            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }
            let result = yield UserService_1.default.Join(data.loginId, data.pwd, data.userType, data.email, data.name, data.nickName, data.phoneNumber, data.gender, data.address, data.addressDetail);
            if (!result)
                return this.false(res, 'LA');
            const mailResult = yield MailService_1.default.authEmail(data.email, 'USER_JOIN', result.contents);
            if (mailResult.accepted[0].includes(data.email))
                this.true(res, 'UA0');
            else
                this.false(res, 'UA1');
        });
        this.userLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            Logger_1.default.info("Call API - " + req.originalUrl);
            let data = DataChecker_1.default.mergeObject(DataChecker_1.default.stringArrCheck(res, req.body, ["loginId", "pwd"], true));
            if (typeof data == 'string') {
                return this.clientReqError(res, data);
            }
            Logger_1.default.info('?');
            let accessInfo = yield UserService_1.default.Access(res, data.loginId, data.pwd);
            // 세션 등록 추가
            if (accessInfo)
                return this.true(res, 'TS1', { token: accessInfo });
            else
                return this.false(res, accessInfo.message);
        });
        this.userEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['email']));
                let result = yield UserService_1.default.emailCheck(data.email);
                if (result)
                    return this.true(res, '01');
                else
                    return this.false(res, '01');
            }
            catch (err) {
                Logger_1.default.debug(err + 'is Occured');
                return this.err(res, 'A01', err);
            }
        });
        this.userPhone = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['phoneNumber']));
                //todo 전화번호 추가 작업 필요
                let result = yield UserService_1.default.phoneCheck(data.phoneNumber);
                if (result)
                    return this.true(res, '01');
                else
                    return this.false(res, '01');
            }
            catch (err) {
                Logger_1.default.debug(err + ' is Occured');
                return this.err(res, 'A01', err);
            }
        });
        this.resetPw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['loginId', 'originPwd', 'newPwd']));
                if (typeof data == 'string') {
                    return this.clientReqError(res, data);
                }
                let updateResult = yield UserService_1.default.updatePwd(data.loginId, data.originPwd, data.newPwd);
                /*     if (updateResult.result)
                         this.true(res, updateResult);
                     else
                         this.false(res, updateResult);*/
            }
            catch (err) {
                Logger_1.default.debug(err + 'is Occured');
                return this.err(res, 'A01', err);
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let data = DataChecker_1.default.mergeObject(DataChecker_1.default.needArrCheck(res, req.body, ['loginId']), DataChecker_1.default.stringArrCheck(res, req.body, ['email', 'phoneNumber', 'address', 'addressDetail'], false));
                if (typeof data == 'string') {
                    return this.clientReqError(res, data);
                }
                let result = yield UserService_1.default.updateUser(data.loginId, data.email, data.phoneNumber, data.address, data.addressDetail);
                if (result)
                    this.true(res, '01');
                else
                    this.false(res, '02');
            }
            catch (err) {
                Logger_1.default.debug(err + 'is Occured');
                return this.err(res, 'A01', err);
            }
        });
    }
}
exports.default = new UserController();
//# sourceMappingURL=UserController.js.map