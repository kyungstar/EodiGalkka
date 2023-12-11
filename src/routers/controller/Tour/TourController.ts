import {Request, Response} from "express";


import Logger from "../../../modules/Logger";
import DataValiator from "../../../service/DataValiator";
import {
    cityInterface, citySchema,
    continentsInterface,
    continentsSchema,
    countryInterface,
    countrySchema, crawlerInterface, crawlerSchema
} from "../../../repositories/TourEntity";
import ResHandler from "../ResHandler";
import TourService from "../../../service/tour/TourService";
import CrawlerService from "../../../service/tour/CrawlerService";


class TourController extends ResHandler {

    public earthList = async (req: Request, res: Response) => {

        try {

            const [getEarthResult, worldCode, worldList] = await TourService.getEarthList();

            if (!getEarthResult) {
                this.false(worldCode, res);
                return;
            }

            this.true("지구본", res, worldList);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public continentsList = async (req: Request, res: Response) => {

        try {

            // 데이터 검증
            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, continentsSchema),
            ) as continentsInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [getContinentsResult, continentsCode, continentsList] = await TourService.getContinentsList(data);

            if (!getContinentsResult) {
                this.false(continentsCode, res);
                return;
            }

            this.true(continentsCode, res, continentsList);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


    public countryList = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, countrySchema),
            ) as countryInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [getCountryResult, countryCode, countryList] = await TourService.getCountryList(data);

            if (!getCountryResult) {
                this.false(countryCode, res);
                return;
            }

            this.true(countryCode, res, countryList);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public cityList = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, citySchema),
            ) as  cityInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [getCountryResult, countryCode, countryList] = await TourService.getCityList(data);

            if (!getCountryResult) {
                this.false(countryCode, res);
                return;
            }

            this.true(countryCode, res, countryList);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public crawlerList = async (req: Request, res: Response) => {

        try {

            const data = DataValiator.checkSchema(
                DataValiator.initRequest(req, res, crawlerSchema),
            ) as  crawlerInterface;

            const checkResult = DataValiator.checkResult(data);

            if (!checkResult) {
                return this.validErr(res);
            }

            const [getCrawlerResult, crawlerCode, crawlerList] = await CrawlerService.getCrawlerList(data.targetKeyword, data.sort, data.page)

            if (!getCrawlerResult) {
                this.false(crawlerCode, res);
                return;
            }

            this.true(crawlerCode, res, crawlerList);

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }



}


export default new TourController();
