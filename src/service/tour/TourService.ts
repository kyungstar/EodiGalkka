import DBHelper from "../../modules/db/DBHelpers";
import Logger from "../../modules/middlewares/Logger";


import {MyAuth} from "../../modules/middlewares/SecurityAuth";
import {} from "../../../src/repositories/TourEntity";
import {World, Country, City, Continents, travel} from '../../entities/Tour';
import {AppDataSource} from "../../modules/middlewares/DBConfig";
import crypto from "crypto";
import {decryptColumnList, encryptData, decryptData} from "../../../config/Security";
import {User} from "../../entities/User";

export default class UserService {

    public static async getEarthList() {
        try {


            const WorldHelper = AppDataSource.getRepository(World);

            const worldList = await WorldHelper.find({order: {order_num: 'ASC'}});

            if (worldList)
                return [true, "세계 목록", {worldList: worldList}];


            return [false, "세계 목록 조회 실패", null]

        } catch (err) {
            Logger.error("getEarthList " + err);
            return [false, "세계 목록 조회 실패", err]
        }
    }

    public static async getEarthDetail() {
        try {

            return true;



        } catch (err) {
            Logger.error("getUserPhone " + err);
            return null;
        }
    }


    public static async getWorldList() {
        try {

            return true;



        } catch (err) {
            Logger.error("getUserPhone " + err);
            return null;
        }
    }


    public static async getWorldDetail() {
        try {

            return true;



        } catch (err) {
            Logger.error("getUserPhone " + err);
            return null;
        }
    }


    public static async getCountryList() {
        try {

            return true;



        } catch (err) {
            Logger.error("getUserPhone " + err);
            return null;
        }
    }


    public static async getCountryDetail() {
        try {

            return true;



        } catch (err) {
            Logger.error("getUserPhone " + err);
            return null;
        }
    }




}



