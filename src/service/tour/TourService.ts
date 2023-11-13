import Logger from "../../modules/middlewares/Logger";

import {World, Country, City, Continents, Travel} from '../../entities/Tour';
import {AppDataSource} from "../../modules/middlewares/DBConfig";
import {userJoinInterface} from "../../repositories/UserEntity";
import {cityInterface, continentsInterface, countryInterface} from "../../repositories/TourEntity";




export default class UserService {

    public static async getEarthList() {
        try {


            const WorldHelper = AppDataSource.getRepository(World);

            const worldList = await WorldHelper.find({order: {order_num: 'ASC'}});

            if (worldList)
                return [true, "세계 목록", {worldList: worldList}];


            return [false, "세계 목록 조회 실패", null];

        } catch (err) {
            Logger.error("getEarthList " + err);
            return [false, "세계 목록 조회 실패", err]
        }
    }


    public static async getContinentsList(continents: continentsInterface) {
        try {

            const ContinentsHelper = AppDataSource.getRepository(Continents);

            const continentsList = await ContinentsHelper.find({
                where: { world: { world_seq: continents.worldSeq }},
                order: { order_num: 'ASC' },
            });

            if (continentsList)
                return [true, "대륙 목록", {continentsList: continentsList}];

            return [false, "목록 조회 실패", null]

        } catch (err) {
            Logger.error("getEarthList " + err);
            return [false, "목록 조회 실패", err]
        }
    }


    public static async getCountryList(country: countryInterface) {
        try {

            const CountryHelper = AppDataSource.getRepository(Country);

            const countryList = await CountryHelper.find({
                where: { continents: { continents_seq: country.continentsSeq}},
                order: { order_num: 'ASC' }
            });

            if (countryList)
                return [true, "도시 목록", {countryList: countryList}];

            return [false, "도시 상세", null];

        } catch (err) {
            Logger.error("getCountryList " + err);
            return [false, "목록 조회 실패", err]
        }
    }


    public static async getCityList(city: cityInterface) {
        try {

            const CityHelper = AppDataSource.getRepository(City);

            const cityList = await CityHelper.find({
                where: { country: { country_seq: city.countrySeq}},
                order: { order_num: 'ASC' }
            });

            if (cityList)
                return [true, "도시 목록", {cityList: cityList}];

            return [false, "도시 상세", null];

        } catch (err) {
            Logger.error("getCountryList " + err);
            return [false, "목록 조회 실패", err]
        }
    }


    public static async getTravelList() {
        try {

            const TravelHelper = AppDataSource.getRepository(Travel);

            const traveList = await TravelHelper.find({order: {order_num: 'ASC'}});

            if (traveList)
                return [true, "여행 목록", {traveList: traveList}];

            return [false, "여형 상세", null];

        } catch (err) {
            Logger.error("getTravelList " + err);
            return [false, "목록 조회 실패", err]
        }
    }

    public static async getTravelDetail(travelSeq: number) {
        try {

            const TravelHelper = AppDataSource.getRepository(Travel);

            const travelData = await TravelHelper.findOneBy({travel_seq: travelSeq});

            if (travelData)
                return [true, "여행 상세", {travelData: travelData}];

            return [false, "여행 상세 조회 실패", null];

        } catch (err) {
            Logger.error("getTravelDetail " + err);
            return [false, "목록 조회 실패", err]
        }
    }




}



