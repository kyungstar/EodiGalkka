import DBHelper from "../../modules/db/DBHelpers";
import Logger from "../../modules/middlewares/Logger";

import {MyAuth} from "../../modules/middlewares/SecurityAuth";
import {userJoinInterface, userLoginInterface} from "../../../src/repositories/UserEntity";


export default class UserService {

    public static async getUserPhone(phoneNumber: string) {

        try {

            const phoneData = await DBHelper.findOne("t_node_user", {phone_number: phoneNumber});

            if(!phoneData)
                return false;

            return phoneData;

        } catch (err) {
            Logger.error("getUserPhone" + err);
            return false;
        }
    }

    public static async getUserEmail(email: string) {

        try {

            const emailData = await DBHelper.findOne("t_node_user", {
                email: email
            }, ["email"]);

            if(!emailData)
                return false;

            return emailData;


        } catch (err) {
            Logger.error("getUserEmail" + err);
            return false;
        }
    }


    public static async getUserData(userId: string) {

        try {

            let userData = await DBHelper.findOne("t_node_user", {
                user_id: userId
            });

            if (!userData)
                return false;

            return userData;

        } catch (err) {
            Logger.error("getUserData" + err);
            return false;
        }
    }

    public static async getLoginData(loginId: string) {

        try {

            let loginData = await DBHelper.findOne("t_node_login", {
                login_id: loginId
            });

            if (!loginData)
                return false

            return loginData;

        } catch (err) {
            Logger.error("getLoginData" + err);
            return false;
        }
    }


    public static async userJoin(userJoin: userJoinInterface): Promise<[boolean, string, any?]>  {

        try {

            const emailData = await this.getUserEmail(userJoin.email);

            if(emailData)
                return [false, "이미 중복된 이메일입니다.", emailData];


            const phoneCheck = await this.getUserPhone(userJoin.email);

            if (phoneCheck)
                return [false, "이미 중복된 전화번호입니다.", phoneCheck];

            const userId = await MyAuth.generateUserId();

            // userId 예외처리
            if (!userId)
                return [false, "회원가입에 실패하였습니다."];

            const passWd = await MyAuth.getEncryptPwd(userId, userJoin.pwd);

            // 비밀번호 예외처리
            if (!passWd)
                return [false, "회원가입에 실패하였습니다."];


            const result = await DBHelper.transaction([
                DBHelper.insertQuery("t_node_login", {
                    user_id: userId,
                    login_id: userJoin.loginId,
                    pwd: passWd
                }, ""),
                DBHelper.insertQuery("t_node_user", {
                    user_id: userId,
                    login_id: userJoin.loginId,
                    user_type: userJoin.userType,
                    phone_number: userJoin.phoneNumber,
                    user_name: userJoin.name,
                    nickname: userJoin.nickName,
                    gender: userJoin.gender,
                    address: userJoin.address,
                    address_detail: userJoin.addressDetail,
                    email: userJoin.email
                })
            ]);


            if (!result)
                return [false, "회원가입에 실패하였습니다."];

            return [true, "회원가입에 성공하였습니다."];


        } catch (err) {
            Logger.error("userJoin" + err);
            return [false, "회원가입에 실패하였습니다."];
        }
    }


    public static async userLogin(userLogin: userLoginInterface): Promise<[boolean, string, any?]>  {

        try {


            const loginData = await this.getLoginData(userLogin.loginId);

            if(!loginData)
                return [false, "아이디가 일치하지 않습니다."];

            const userData = await this.getUserData(loginData.user_id);

            if(!userData)
                return [false, "로그인에 실패했습니다."];

            const pwdCheck = await MyAuth.compareEncryptPwd(loginData.user_id, loginData.pwd, loginData.pwd);

           if(!pwdCheck)
                return [false, "로그인에 실패했습니다."];

            Logger.info(pwdCheck);

            return [true, "아이디 일치"];
/*


            const pwdCheck = await MyAuth.compareEncryptPwd(loginData.user_id, loginData.pwd, loginData.pwd);

            if(!pwdCheck)
                return [false, "로그인에 실패했습니다."];

            const myToken = MyAuth.createToken({userId: loginData.user_id});

            if(!myToken)
                return [false, "로그인에 실패했습니다."];

            const myData = [userData, myToken];

            return [true, "로그인 성공", myData];*/


        } catch (err) {
            Logger.error("userJoin" + err);
            return [false, "회원가입에 실패하였습니다."];
        }
    }

}



