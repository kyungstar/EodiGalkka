import {application, Request, Response} from "express";
import axios from 'axios';

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";

import UserService from "../../service/user/UserService";
import WorldService from "../../service/tour/WorldService";
import CountryService from "../../service/tour/country/CountryService";
import CrawlerService from "../../service/tour/CrawlerService";



class TourController extends ResController {

    public world = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, []),
            DataChecker.stringArrCheck(res, req.body, [], false)
        ) as {
            authType: string,
            email: string,
            loginId: string,
            authPwd: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        try {

            const worldList = await WorldService.worldList();

            this.resultInterpreter(res, worldList);

        } catch (err) {
            this.errInterpreter(res, err);
        }

    }

    public continents = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ["worldSeq"]),
            DataChecker.stringArrCheck(res, req.body, [], false)
        ) as {
            worldSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        try {

            const continentsList = await WorldService.continentsList(data.worldSeq);

            this.resultInterpreter(res, continentsList);

        } catch (err) {
            this.errInterpreter(res, err);
        }

    }

    public country = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ["continentsSeq"]),
            DataChecker.stringArrCheck(res, req.body, [], false)
        ) as {
            continentsSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        try {

            const countryList = await CountryService.countryList(data.continentsSeq);

            this.resultInterpreter(res, countryList);

        } catch (err) {
            this.errInterpreter(res, err);
        }

    }

    public crawlerCountry = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ["countrySeq"]),
            DataChecker.stringArrCheck(res, req.body, ["sort"], true),
            DataChecker.numberArrCheck(res, req.body, ["page"], 1, false)
        ) as {
            countrySeq: number,
            page: number,
            sort: string
        };


        if (typeof data == 'string') {
            return this.clientReqError(res, data);
        }

        try {

            const countryList = await CrawlerService.crawlerList(data.countrySeq, data.sort, data.page);

            this.resultInterpreter(res, countryList);

        } catch (err) {
            this.errInterpreter(res, err);
        }

    }



}



export default new TourController();
