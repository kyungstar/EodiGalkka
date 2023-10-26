import {Request, Response} from "express";


import Logger from "../../../modules/middlewares/Logger";
import DataValiator from "../../../service/DataValiator";
import {
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

            const [userJoinResult, userJoinCode] = await UserService.insertUserSingUp(data);

            if (userJoinResult)
                this.true(userJoinCode, res);
            else
                this.false(userJoinCode, res);

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

            const [userLoginResult, userLoginCode, myData] = await UserService.checkUserSingIn(data);

            if (userLoginResult)
                this.true(userLoginCode, res, myData);
            else
                this.false(userLoginCode, res);

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

            if (profileResult)
                this.true(profileCode, res, myProfile);
            else
                this.false(profileCode, res);


        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


}


export default new UserController();
