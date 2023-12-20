import Logger from "../../modules/Logger";

import {cityInterface, continentsInterface, countryInterface} from "../../repositories/TourEntity";
import DBHelper from "../../modules/DBHelper";


export default class UserService {

    public static async getEarthList() {
        try {

            const worldList = await DBHelper.find("world");

            if (!worldList)
                return [false, "세계 목록 조회 실패", null];

            return [true, "세계 목록", {worldList: worldList}];


        } catch (err) {
            Logger.error("getEarthList " + err);
            return [false, "세계 목록 조회 실패", err]
        }
    }


    public static async getContinentsList(continents: continentsInterface) {
        try {

            /* const ContinentsHelper = AppDataSource.getRepository(Continents);

             const continentsList = await ContinentsHelper.find({
                 where: { world: { world_seq: continents.worldSeq }},
                 order: { order_num: 'ASC' },
             });

             if (continentsList)
                 return [true, "대륙 목록", {continentsList: continentsList}];
 */
            return [false, "목록 조회 실패", null]

        } catch (err) {
            Logger.error("getEarthList " + err);
            return [false, "목록 조회 실패", err]
        }
    }


    public static async getCountryList(country: countryInterface) {
        try {

            /*   const CountryHelper = AppDataSource.getRepository(Country);

               const countryList = await CountryHelper.find({
                   where: { continents: { continents_seq: country.continentsSeq}},
                   order: { order_num: 'ASC' }
               });

               if (countryList)
                   return [true, "도시 목록", {countryList: countryList}];
   */
            return [false, "도시 상세", null];

        } catch (err) {
            Logger.error("getCountryList " + err);
            return [false, "목록 조회 실패", err]
        }
    }


    public static async getCityList(city: cityInterface) {
        try {

            /*const CityHelper = AppDataSource.getRepository(City);

            const cityList = await CityHelper.find({
                where: { country: { country_seq: city.countrySeq}},
                order: { order_num: 'ASC' }
            });

            if (cityList)
                return [true, "도시 목록", {cityList: cityList}];

            */
            return [false, "도시 상세", null];

        } catch (err) {
            Logger.error("getCountryList " + err);
            return [false, "목록 조회 실패", err]
        }
    }


}



