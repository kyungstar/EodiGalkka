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
const ResultBox_1 = __importDefault(require("../../dto/ResultBox"));
const UserEntity_1 = require("../../entities/User/UserEntity");
const Logger_1 = __importDefault(require("../../../modules/Logger"));
const typeorm_1 = require("typeorm");
const escape = require('mysql').escape;
const moment = require('moment');
const crypto = require("crypto");
class PayService extends ResultBox_1.default {
    static checkUserAuth(loginId, authType, authPwd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_login", {
                    auth_type: authType,
                    auth_pwd: authPwd,
                    login_id: loginId,
                    auth_expire_date: '\\> NOW()'
                }, ["*"]));
                if (!authData)
                    return false;
                const isAuth = authType === 'USER_JOIN' ? '0' : 1;
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", {
                    initial_auth: 1,
                    is_auth: 0,
                }, {
                    login_id: loginId
                }));
                if (result)
                    return true;
                else
                    return false;
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
                let result = yield Mysql_1.default.getOne(`
                SELECT *
                FROM t_node_user
                WHERE CONVERT(AES_DECRYPT(UNHEX(phone_number), ${escape(config_1.default.DB.encrypt_key)}) USING utf8) = ${escape(phoneNumber)}
            `);
                if (result)
                    return false;
                else
                    return true;
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
                }, ["*"]));
                if (result)
                    return false;
                else
                    return true;
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
                let userId = Math.random().toString(36).substring(7, 25);
                let newPwd = "";
                for (let i = 0; i < 6; i++) {
                    const rnum = Math.floor(Math.random() * pwd.length);
                    newPwd += pwd.substring(rnum, rnum + 1);
                }
                console.log(pwd);
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
                        pwd: pwd,
                        auth_type: 'USER_JOIN',
                        auth_pwd: newPwd,
                        auth_expire_date: '\\NOW() + INTERVAL 3 MINUTE',
                        reg_date: '\\NOW()'
                    })
                ]);
                return { contents: '고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.' };
            }
            catch (err) {
                return err;
            }
        });
    }
    static Access(res, loginId, pwd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = (0, typeorm_1.getRepository)(UserEntity_1.User);
                const newUser = new UserEntity_1.User();
                newUser.name = 'John Doe';
                newUser.email = 'john@example.com';
                yield userRepository.save(newUser);
                console.log('사용자 생성 완료');
                /*let userData = await DB.getOne(QM.Select("t_node_user", {
                    login_id: loginId
                }, ["*"]));
                 if (!userData)
                    return null;
    */
                let loginData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_login", {
                    login_id: loginId
                }, ["*"]));
                // 로그인정보 존재하지 않음.
                if (!loginData)
                    return { result: false, message: 'NL0' };
                if (loginData.initial_auth === 0 || loginData.try_cnt === 3 || loginData.try_cnt > 3) {
                    Logger_1.default.info(loginData.initial_auth, 'loginData');
                    Logger_1.default.info(loginData.try_cnt, 'loginData');
                    Logger_1.default.info(loginData.initial_auth, 'loginData');
                    return { result: false, message: 'PT0' };
                }
                // todo 트랜잭션 처리 필요함.
                // 비밀번호 불일치
                if (pwd !== loginData.pwd) {
                    let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", { try_cnt: '\\try_cnt + 1' }, { user_id: loginData.user_id }));
                    if (result)
                        return { result: false, code: 'USO' };
                    else
                        return { result: false, code: 'USO' };
                }
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", { try_cnt: 0 }, { user_id: loginData.user_id }));
                /*  if (result) {
                      const token = createToken(new JwtModel(({u: userData.user_id, t: userData.user_type} as JwtModel)));
      
                      return token;
                  } else {
                      return false;
                  }*/
            }
            catch (err) {
                return err;
            }
        });
    }
    static getUserAuthData(loginId, authType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let pwd = moment().format('YYYYMMDD') + loginId + moment().format('DDD');
                let newPwd = "";
                for (let i = 0; i < 6; i++) {
                    const rnum = Math.floor(Math.random() * pwd.length);
                    newPwd += pwd.substring(rnum, rnum + 1);
                }
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", {
                    auth_pwd: newPwd,
                    auth_expire_date: '\\NOW() + INTERVAL 3 MINUTE'
                }, { login_id: loginId }));
                if (!result)
                    return false;
                if (authType === 'FIND_ID') {
                    return { contents: '[휴먼계정 해제] 고객님의 메일 인증 비밀번호는 ' + newPwd + '입니다.' };
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
    static getUserData(loginId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {
                    login_id: loginId
                }, ["*"]));
                if (!loginData && !loginData.email)
                    return false;
                else
                    return loginData;
            }
            catch (err) {
                return err;
            }
        });
    }
    static getUserLoginData(loginId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_login", {
                    login_id: loginId
                }, ["*"]));
                if (loginData)
                    return loginData;
                else
                    return false;
            }
            catch (err) {
                return err;
            }
        });
    }
    static updatePwd(loginId, originPwd, newPwd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let loginData = yield this.getUserLoginData(loginId);
                if (!loginData)
                    return { result: false, code: 'NEU' };
                if (originPwd !== loginData.pwd)
                    return { result: false, code: 'OPN' };
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_login", {
                    pwd: newPwd
                }, {
                    login_id: loginId
                }));
                if (result)
                    return ResultBox_1.default.JustTrue('01');
                else
                    return ResultBox_1.default.JustFalse('01');
            }
            catch (err) {
                return ResultBox_1.default.JustErr(err);
            }
        });
    }
    static updateUser(loginId, email, phoneNumber, address, addressDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_user", {
                    email: email,
                    phone_number: phoneNumber,
                    address: address,
                    address_detail: addressDetail,
                }, {
                    login_id: loginId
                }));
                return result;
            }
            catch (err) {
                return err;
            }
        });
    }
    static black(targetUserId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_user", {
                    status: status,
                }, {
                    user_id: targetUserId
                }));
                return result;
            }
            catch (err) {
                return err;
            }
        });
    }
    static warn(targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield Mysql_1.default.Executer(QueryMaker_1.default.Update("t_node_user", {
                    warn: '\\warn + 1',
                }, {
                    user_id: targetUserId
                }));
                let userData = yield Mysql_1.default.getOne(QueryMaker_1.default.Select("t_node_user", {
                    user_id: targetUserId
                }, ["*"]));
                if (userData.warn === 5)
                    return userData;
                return result;
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.default = PayService;
//# sourceMappingURL=UserService.js.map