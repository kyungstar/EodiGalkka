import DBHelper from "../../modules/db/DBHelpers";
import Logger from "../../modules/middlewares/Logger";


import {MyAuth} from "../../modules/middlewares/SecurityAuth";
import {userInterface, userJoinInterface, userLoginInterface} from "../../../src/repositories/UserEntity";
import {User, UserLogin} from '../../entities/User';
import {AppDataSource} from "../../modules/middlewares/DBConfig";
import crypto from "crypto";
import {decryptColumnList, encryptData, decryptData} from "../../../config/Security";

export default class UserService {


    public static async getUserPhone(phoneNumber: string): Promise<User | null> {
        try {


            const UserHelper = AppDataSource.getRepository(User);

            const phoneData = await UserHelper.findOneBy({phoneNumber: encryptData(phoneNumber)});

            return phoneData;

        } catch (err) {
            Logger.error("getUserPhone " + err);
            return null;
        }
    }

    public static async getUserEmail(email: string) {

        try {

            const UserHelper = AppDataSource.getRepository(User);

            const emailData = await UserHelper.findOneBy({email: encryptData(email)});

            return emailData;

        } catch (err) {
            Logger.error("getUserEmail " + err);
            return false;
        }
    }


    public static async getUserData(userId: string) {

        try {

            const UserHelper = AppDataSource.getRepository(User);

            const userData = await UserHelper.findOneBy({user_id: userId});

            return userData;

        } catch (err) {
            Logger.error("getUserData" + err);
            return false;
        }
    }

    public static async getLoginData(whereObj: { login_id?: string, user_id?: string }) {

        try {

            const UserHelper = AppDataSource.getRepository(UserLogin);

            const loginData = await UserHelper.findOneBy(whereObj);

            return loginData;

        } catch (err) {
            Logger.error("getLoginData" + err);
            return false;
        }
    }


    public static async insertUserSingUp(userJoin: userJoinInterface): Promise<[boolean, string, any?]> {

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

            const UserHelper = AppDataSource.createQueryRunner();
            await UserHelper.connect();
            await UserHelper.startTransaction();


            try {

                // User 엔티티 생성
                const user: User = new User();
                const userLogin: UserLogin = new UserLogin();

                user.user_id = userId;
                user.type = userJoin.userType;
                user.nickname = userJoin.nickName;
                user.gender = userJoin.gender;
                user.address = userJoin.address;
                user.address_detail = userJoin.addressDetail;

                user.phoneNumber = encryptData(userJoin.phoneNumber);
                user.email = encryptData(userJoin.email);
                user.name = encryptData(userJoin.name);

                userLogin.user_id = userId;
                userLogin.login_id = userJoin.loginId;
                userLogin.password = passWd;

                // User 엔티티와 UserLogin 엔티티를 저장합니다.
                await UserHelper.manager.insert(User, user);
                await UserHelper.manager.insert(UserLogin, userLogin);

                // User 엔티티 저장
                await UserHelper.commitTransaction();

                return [true, "회원가입에 성공하였습니다."];
            } catch (err) {
                await UserHelper.rollbackTransaction();
                Logger.error(err.message);
                return [false, "회원가입에 실패하였습니다."];
            } finally {
                await UserHelper.release();
            }


        } catch (err) {
            Logger.error("userJoin " + err.stack);
            return [false, "회원가입에 실패하였습니다."];
        }
    }


    public static async checkUserSingIn(userLogin: userLoginInterface): Promise<[boolean, string, any?]> {

        try {


            const loginData = await this.getLoginData({login_id: userLogin.loginId});

            if (!loginData) {
                return [false, "아이디가 일치하지 않습니다."];
            }


            const userData = await this.getUserData(loginData.user_id);

            if (!userData)
                return [false, "로그인에 실패했습니당."];

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

            const loginData = await this.getLoginData({user_id: user.userId});

            if (!loginData) {
                return [false, "회원정보가 일치하지 않습니다."];
            }

            const userData: any = await this.getUserData(loginData.user_id);

            if (!userData)
                return [false, "회원정보가 일치하지 않습니다."];
            for(const userProperty in userData) {
                if(decryptColumnList.includes(userProperty))
                    userData[userProperty] = decryptData(userData[userProperty]);

            }

            return [true, "회원정보 일치", {userProfile: userData}];

        } catch (err) {
            Logger.error("userJoin" + err);
            return [false, "회원가입에 실패하였습니다."];
        }
    }

}



