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
const config_1 = __importDefault(require("../../../../config"));
const Mysql_1 = __importDefault(require("../../../modules/Mysql"));
const QueryMaker_1 = __importDefault(require("../../../modules/QueryMaker"));
const MailService_1 = __importDefault(require("../mail/MailService"));
const Logger_1 = __importDefault(require("../../../modules/Logger"));
const JwtAuth_1 = require("../../../middlewares/JwtAuth");
const ResultBox_1 = __importDefault(require("../../dto/ResultBox"));
const DataChecker_1 = __importDefault(require("../../util/DataChecker"));
const escape = require('mysql').escape;
const moment = require('moment');
const crypto = require("crypto");
class UserService extends ResultBox_1.default {
    static checkUserAuth(loginId, email, authType, authPwd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData;
                // 비밀번호 찾기는, 아이디를 기반으로 진행된다.
                if (authType === 'FIND_PW')
                    userData = yield UserService.getUserDataByLoginId(loginId);
                // 아이디 찾기는, 고객의 이메일을 기반으로 진행된다.
                else if (authType === 'FIND_ID')
                    userData = yield UserService.getUserDataByEmail(email);
                if (!userData)
                    return this.JustFalse('NU0');
                const authData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_login", {
                    auth_type: authType,
                    auth_pwd: authPwd,
                    user_id: userData.user_id,
                    auth_expire_date: '\\> NOW()'
                }, {}, ["*"]));
                if (!authData)
                    return this.JustTrue('AU0');
                if (authType === 'USER_JOIN') {
                    let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", {
                        initial_auth: 1,
                        is_auth: 0,
                    }, {
                        login_id: loginId
                    }));
                    if (result)
                        return this.JustTrue('NS0');
                    else
                        return this.JustFalse('NU0');
                }
                else if (authType === 'FIND_ID') {
                    return this.ObjTrue('FI0', [{ loginId: authData.login_id }]);
                }
                else {
                    return this.JustTrue('FP0');
                }
            }
            catch (err) {
                Logger_1.default.error(err + ' Is Occurred');
                return false;
            }
        });
    }
    static phoneCheck(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {}, {
                    phone_number: phoneNumber
                }, ["*"]));
                if (result)
                    return this.JustFalse('P01');
                else
                    return this.JustTrue('P01');
            }
            catch (err) {
                Logger_1.default.debug(err + ' is Occured');
                return false;
            }
        });
    }
    static emailCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {
                    email: email
                }, {}, ["*"]));
                if (result)
                    return this.JustFalse('E01');
                else
                    return this.JustTrue('E01');
            }
            catch (err) {
                Logger_1.default.debug(err + ' is Occured');
                return false;
            }
        });
    }
    static Join(loginId, pwd, userType, email, name, nickName, phoneNumber, gender, address, addressDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 전화번호 중복 검증
                if (DataChecker_1.default.onlyResultInterpreter(yield this.phoneCheck(phoneNumber), false))
                    return this.JustErr('PA0');
                // 이메일 중복 검증
                if (DataChecker_1.default.onlyResultInterpreter(yield this.emailCheck(email), false))
                    return this.JustErr('EA0');
                let userId = Math.random().toString(36).substring(7, 25);
                let newPwd = "";
                for (let i = 0; i < 6; i++) {
                    const rnum = Math.floor(Math.random() * pwd.length);
                    newPwd += pwd.substring(rnum, rnum + 1);
                }
                yield Mysql_1.default.get([
                    QueryMaker_1.default.Insert("t_node_user", {
                        user_id: userId,
                        login_id: loginId,
                        user_type: userType,
                        email: email,
                        user_name: '\\(HEX(AES_ENCRYPT(' + escape(name) + ', ' + escape(config_1.default.DB.encrypt_key) + ')))',
                        nickname: nickName,
                        phone_number: '\\(HEX(AES_ENCRYPT(' + escape(phoneNumber) + ', ' + escape(config_1.default.DB.encrypt_key) + ')))',
                        gender: gender,
                        address: address,
                        address_detail: addressDetail,
                        status: 50
                    }),
                    QueryMaker_1.default.Insert("t_node_login", {
                        user_id: userId,
                        login_id: loginId,
                        pwd: crypto.createHash('sha512').update(pwd).digest('hex'),
                        auth_type: 'USER_JOIN',
                        auth_pwd: newPwd,
                        auth_expire_date: '\\NOW() + INTERVAL 3 MINUTE',
                        reg_date: '\\NOW()'
                    })
                ]);
                const contents = '고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.';
                let sendEmailResult = yield MailService_1.default.send(email, '회원가입 인증코드입니다.', contents);
                if (sendEmailResult.accepted.includes(email))
                    return this.JustTrue('01');
                else
                    return this.JustFalse('01');
            }
            catch (err) {
                return this.JustErr(err);
            }
        });
    }
    static Access(res, loginId, pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {
                    login_id: loginId
                }, {}, ["*"]));
                if (!userData)
                    return this.JustFalse('NU0');
                let loginData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_login", {
                    login_id: loginId
                }, {}, ["*"]));
                // 로그인정보 존재하지 않음.
                if (!loginData)
                    return this.JustFalse('NL0');
                if (loginData.initial_auth === 0 || loginData.try_cnt === 3 || loginData.try_cnt > 3) {
                    return this.JustFalse('PT0');
                }
                // todo 트랜잭션 처리 필요함.
                // 비밀번호 불일치
                if (pwd !== loginData.pwd) {
                    let pwdTryUpdate = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", { try_cnt: '\\try_cnt + 1' }, { user_id: loginData.user_id }));
                    if (pwdTryUpdate)
                        return this.JustFalse('IP0');
                    else
                        return this.JustErr('99');
                }
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", { try_cnt: 0 }, { user_id: loginData.user_id }));
                if (result) {
                    const token = (0, JwtAuth_1.createToken)(new JwtAuth_1.JwtModel({ u: userData.user_id, t: userData.user_type }));
                    return this.ObjTrue('01', [{ token: token }]);
                }
                else {
                    return this.JustFalse('01');
                }
            }
            catch (err) {
                return this.JustErr(err);
            }
        });
    }
    static getUserAuthData(userId, authType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pwd = moment().format('YYYYMMDD') + userId + moment().format('DDD');
                let newPwd = "";
                for (let i = 0; i < 6; i++) {
                    const rnum = Math.floor(Math.random() * pwd.length);
                    newPwd += pwd.substring(rnum, rnum + 1);
                }
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", {
                    auth_pwd: newPwd,
                    auth_type: authType,
                    auth_expire_date: '\\NOW() + INTERVAL 3 MINUTE'
                }, { user_id: userId }));
                if (!result)
                    return this.JustFalse('99');
                if (authType === 'FIND_ID') {
                    return this.ObjTrue('01', [{ contents: '[휴먼계정 해제] 고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.' }]);
                }
                else {
                    return { contents: '고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.' };
                }
            }
            catch (err) {
                Logger_1.default.error(err + ' is Occurred');
                return err;
            }
        });
    }
    static getUserDataByLoginId(loginId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {
                    login_id: loginId
                }, {}, ["*"]));
                if (!loginData && !loginData.email)
                    return this.JustFalse('01');
                else
                    return this.ObjTrue('01', loginData);
            }
            catch (err) {
                return err;
            }
        });
    }
    static getUserDataByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {
                    email: email
                }, {}, ["*"]));
                if (!loginData)
                    return this.JustFalse('01');
                else
                    return this.ObjTrue('01', loginData);
            }
            catch (err) {
                return err;
            }
        });
    }
    static updatePwd(userId, newPwd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", {
                    pwd: crypto.createHash('sha512').update(newPwd).digest('hex')
                }, {
                    user_id: userId
                }));
                if (result)
                    return this.JustTrue('01');
                else
                    return this.JustFalse('01');
            }
            catch (err) {
                return err;
            }
        });
    }
    static authPwd(loginId, pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_login", {
                    login_id: loginId,
                    pwd: pwd
                }, {}, ["*"]));
                if (loginData)
                    return this.JustTrue('01');
                else
                    return this.JustFalse('01');
            }
            catch (err) {
                return err;
            }
        });
    }
    static updateUser(loginId, email, phoneNumber, address, addressDetail, zipCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_user", {
                    email: email,
                    phone_number: phoneNumber,
                    address: address,
                    address_detail: addressDetail,
                    zip_code: zipCode
                }, {
                    login_id: loginId
                }));
                if (result)
                    return this.JustTrue('01');
                else
                    return this.JustFalse('01');
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=UserService.js.map