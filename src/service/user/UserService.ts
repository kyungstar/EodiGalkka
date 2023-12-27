import Logger from "../../modules/Logger";

import {MyAuth} from "../../modules/SecurityAuth";
import {userInterface, userJoinInterface, userLoginInterface} from "../../../src/repositories/UserEntity";
import DBHelper from "../../modules/DBHelper";


export default class UserService {


    // @ts-ignore
    public static async getUserPhone(phoneNumber: string) {
        try {

            const phoneData = await DBHelper.findOne("user",{phone_number: phoneNumber});

            if(!phoneData)
                return null;

            return phoneData;

        } catch (err) {
            Logger.error("getUserPhone " + err);
            return null;
        }
    }

    public static async getUserEmail(email: string) {

        try {

            const emailData = await DBHelper.findOne("user",{email: email});

            if(!emailData)
                return null;

            return emailData;

        } catch (err) {
            Logger.error("getUserEmail " + err);
            return false;
        }
    }


    public static async getUserData(userId: string) {

        try {

            const userData = await DBHelper.findOne("user",
                {user_id: userId},
                ["user_id", "email", "phone_number", "name", "nickname", "gender", "address", "address_detail"]);

            if(!userData)
                return null;

            return userData;

        } catch (err) {
            Logger.error("getUserData" + err);
            return false;
        }
    }

    public static async getLoginData(whereObj: { login_id?: string, user_id?: string }) {

        try {

            const loginData = await DBHelper.findOne("user_login", whereObj);

            if(!loginData)
                return null;

            return loginData;


        } catch (err) {
            Logger.error("getLoginData : " + err);
            return false;
        }
    }


    public static async userSingUp(userJoin: userJoinInterface): Promise<[boolean, string, any?]> {

        try {

            const phoneCheck = await this.getUserPhone(userJoin.phoneNumber);

            if (phoneCheck)
                return [false, "이미 중복된 전화번호입니다.", phoneCheck];

            const emailData = await this.getUserEmail(userJoin.email);

            if (emailData)
                return [false, "이미 중복된 이메일입니다.", emailData];

            const userId = await MyAuth.generateUserId();

            // userId 예외처리
            if (!userId)
                return [false, "회원가입에 실패하였습니다."];

            const passWd = await MyAuth.getEncryptPwd(userId, userJoin.pwd);

            // 비밀번호 예외처리
            if (!passWd)
                return [false, "회원가입에 실패하였습니다."];


            const userInsertResult = await DBHelper.tranQuery([
                DBHelper.getInsertQuery("user", {
                    user_id: userId,
                    type: userJoin.userType,
                    nickname: userJoin.nickName,
                    gender: userJoin.gender,
                    email: userJoin.email,
                    phone_number: userJoin.phoneNumber,
                    address: userJoin.address,
                    address_detail: userJoin.addressDetail,
                    name: userJoin.name
                }),
                DBHelper.getInsertQuery("user_login",{
                    user_id: userId,
                    login_id: userJoin.loginId,
                    password: passWd
                })
            ])

            if(!userInsertResult)
                return [false, "회원가입에 실패하였습니다."];

            return [true, "회원가입에 성공하였습니다."];


        } catch (err) {
            Logger.error("userJoin " + err.stack);
            return [false, "회원가입에 실패하였습니다."];
        }
    }


    public static async userLogin(userLogin: userLoginInterface): Promise<[boolean, string, any?]> {

        try {

            const loginData: any = await this.getLoginData({login_id: userLogin.loginId});

            if (!loginData) {
                return [false, "아이디가 일치하지 않습니다."];
            }


            const userData = await this.getUserData(loginData.user_id);

            if (!userData)
                return [false, "로그인에 실패했습니다."];

            const pwdCheck = await MyAuth.compareEncryptPwd(loginData.user_id, loginData.password, userLogin.pwd);

            if (!pwdCheck)
                return [false, "로그인에 실패했습니다."];

            const myToken = MyAuth.createToken({userId: loginData.user_id});

            if (!myToken)
                return [false, "로그인에 실패했습니다."];

            return [true, "로그인 성공", {userData: userData, token: myToken}];


        } catch (err) {
            Logger.error("userJoin" + err);
            return [false, "회원가입에 실패하였습니다."];
        }
    }

    public static async getUserProfile(user: userInterface): Promise<[boolean, string, any?]> {

        try {

            const userData = await this.getUserData(user.userId);

            if (!userData) {
                return [false, "회원정보가 일치하지 않습니다.", null];
            }

            return [true, "회원정보가 일치", {userData: userData}];

        } catch (err) {
            Logger.error("userJoin" + err);
            return [false, "회원정보가 일치하지 않습니다.", null];
        }
    }

    public static async checkCorrectPwd(userLoginData: userLoginInterface): Promise<[boolean, string, any?]> {

        try {

            const loginData: any = await this.getLoginData({login_id: userLoginData.loginId});

            if (!loginData) {
                return [false, "아이디가 일치하지 않습니다."];
            }


            const userData = await this.getUserData(loginData.user_id);

            if (!userData)
                return [false, "로그인에 실패했습니당."];

            const pwdCheck = await MyAuth.compareEncryptPwd(loginData.user_id, loginData.password, userLoginData.pwd);

            if (!pwdCheck)
                return [false, "비밀번호 불일치"];


            return [true, "비밀번호 일치"];

        } catch (err) {
            Logger.error("checkCorrectPwd " + err);
            return [false, "비밀번호 불일치"];
        }
    }

    public static async updateUserJoinData(userJoin: userJoinInterface): Promise<[boolean, string, any?]> {

        try {

            const userData: any = await this.getLoginData({login_id: userJoin.loginId});

            if (!userData)
                return [false, "로그인에 실패했습니당."];


            const userUdtResult = await DBHelper.Update("user",{
                nickname: userJoin.nickName,
                address: userJoin.address,
                address_detail: userJoin.addressDetail,
                phone_number: userJoin.phoneNumber,
                email: userJoin.email,
                name: userJoin.name
            },{
                user_id: userData.user_id
            })

            if(!userUdtResult) {
                return [false, "회원정보 수정에 실패하였습니다."];
            }

            return [true, "회원정보 수정에 성공하였습니다."];

        } catch (err) {
            Logger.error("userJoin " + err.stack);
            return [false, "회원정보 수정에 실패하였습니다."];
        }

    }

    public static async issueTempPwd(userLogin: userLoginInterface): Promise<[boolean, string, any?]> {

        try {

            const userData: any = await this.getLoginData({login_id: userLogin.loginId});

            if (!userData)
                return [false, "로그인에 실패했습니다."];

            const tempPwd = await MyAuth.generateUserId();

            const targetTempPwd = tempPwd.slice(0, 7);


            const passWd = await MyAuth.getEncryptPwd(userData.user_id, targetTempPwd);


            const userPwdUpdate = await DBHelper.Update("user_login", {password: passWd, issue_temp: 1}, {user_id: userData.user_id});

            if(!userPwdUpdate) {
                return [false, "비밀번호 변경 실패"];
            }

            return [true, "비밀번호 변경 성공"];

        } catch (err) {
            Logger.error("userJoin " + err.stack);
            return [false, "비밀번호 변경 실패"];
        }
    }

}



