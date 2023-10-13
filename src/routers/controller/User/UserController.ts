import {Request, Response} from "express";


import Logger from "../../../modules/middlewares/Logger";
import DataValiator from "../../../service/DataValiator";
import {userJoinInterface, userJoinSchema, userLoginInterface, userLoginSchema} from "../../../repositories/UserEntity";
import dataValiator from "../../../service/DataValiator";
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

            if(!checkResult) {
                return this.validErr(res);
            }

            const [userJoinResult, userJoinCode] = await UserService.userJoin(data);

            if(!userJoinResult)
                this.false(userJoinCode, res);

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

            if(!checkResult) {
                return this.validErr(res);
            }

            const [userLoginResult, userLoginCode, myData] = await UserService.userLogin(data);

            if(!userLoginResult)
                this.false(userLoginCode, res);

            this.true(userLoginCode, res, myData);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

}


export default new UserController();