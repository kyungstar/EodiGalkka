import {Request, Response} from "express";


import Logger from "../../../modules/Logger";
import DataValiator from "../../../service/DataValiator";
import {
    userInfoInterface, userInfoSchema,
    userInterface,
    userJoinInterface,
    userJoinSchema,
    userLoginInterface,
    userLoginSchema,
    userSchema
} from "../../../repositories/UserEntity";
import ResHandler from "../ResHandler";
import UserService from "../../../service/user/UserService";


class UserController extends ResHandler {

    public userJoin = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userJoinSchema),
                DataValiator.checkString(['userType', 'loginId', 'pwd', 'email', 'name'
                    , 'nickName', 'phoneNumber', 'gender', 'address', 'addressDetail'])
            ) as userJoinInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [userJoinResult, userJoinCode] = await UserService.userSingUp(data);

            if (!userJoinResult) {
                this.false(userJoinCode, res);
                return;
            }

            this.true(userJoinCode, res);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public userLogin = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userLoginSchema),
                DataValiator.checkString(["loginId", "pwd"])
            ) as userLoginInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [userLoginResult, userLoginCode, myData] = await UserService.userLogin(data);

            if (!userLoginResult) {
                this.false(userLoginCode, res);
                return;
            }

            this.true(userLoginCode, res, myData);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public userProfile = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userSchema),
            ) as userInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [profileResult, profileCode, myProfile] = await UserService.getUserProfile(data);

            if (!profileResult) {
                this.false(profileCode, res);
                return;
            }

            this.true(profileCode, res, myProfile);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public checkPwd = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userLoginSchema),
            ) as userLoginInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [pwdCheckResult, pwdCode] = await UserService.checkCorrectPwd(data);

            if (!pwdCheckResult) {
                this.false(pwdCode, res);
                return;
            }

            this.true(pwdCode, res);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public getUserPhone = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userInfoSchema),
            ) as userInfoInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const phoneData = await UserService.getUserPhone(data.phoneNumber);

            if (!phoneData) {
                this.true("사용가능한 전화번호입니다.", res);
                return;
            }

            this.false("이미 존재하는 전화번호입니다.", res);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public getUserEmail = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userInfoSchema),
            ) as userInfoInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const emailData = await UserService.getUserEmail(data.email);

            if (!emailData) {
                this.false("이미 존재하는 이메일입니다.", res);
                return;
            }

            this.true("사용가능한 이메일입니다.", res);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


    public updateUserInfo = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userJoinSchema),
            ) as userJoinInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [updateResult, updateCode] = await UserService.updateUserJoinData(data);

            if (!updateResult) {
                this.false("회원정보 수정에 성공하였습니다.", res);
                return;
            }

            this.true("회원정보 수정에 성공하였습니다.", res);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public issueTempPwd = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, userLoginSchema),
            ) as userLoginInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const emailData = await UserService.issueTempPwd(data);

            if (!emailData) {
                this.false("이미 존재하는 이메일입니다.", res);
                return;
            }

            this.true("사용가능한 이메일입니다.", res);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


}


export default new UserController();
