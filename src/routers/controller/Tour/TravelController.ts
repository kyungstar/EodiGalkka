import {application, Request, Response} from "express";
import axios from 'axios';

import ResController from "../ResController";


import Logger from "../../../modules/Logger";
import DataChecker from "../../util/DataChecker";

import UserService from "../../service/user/UserService";
import WorldService from "../../service/tour/world/WorldService";
import CountryService from "../../service/tour/country/CountryService";
import CrawlerService from "../../service/tour/CrawlerService";
import CityService from "../../service/tour/city/CityService";
import TravelService from "../../service/tour/travel/TravelService";


/**
 * @swagger
 * tags:
 *   name: Tour
 *   description: Tour APIs
 */

class TravelController extends ResController {

    /**
     * @swagger
     * tags:
     *   - name: Travel
     *     description: Travel APIs
     */
    /**
     * @swagger
     * /api/tour/travel/list:
     *   post:
     *     summary: Get the list of worlds
     *     description: Get the list of worlds
     *     tags: [Tour]
     *     requestBody:
     *       description: Optional request body
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               authType:
     *                 type: string
     *               email:
     *                 type: string
     *               loginId:
     *                 type: string
     *               authPwd:
     *                 type: string
     *     responses:
     *       '200':
     *         description: Success response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *       '400':
     *         description: Bad Request
     */
    public travelList = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.needArrCheck(res, req.body, ['targetSeq', 'targetType']),
            DataChecker.stringArrCheck(res, req.body, [], false)
        ) as {
            targetSeq: number,
            targetType: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const travelList = await TravelService.getTravelList(data.targetSeq, data.targetType);

            await this.resultInterpreter(req, res, travelList);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    /**
     * @swagger
     * tags:
     *   - name: Travel
     *     description: Travel APIs
     */
    /**
     * @swagger
     * /api/tour/travel/list:
     *   post:
     *     summary: Get the list of worlds
     *     description: Get the list of worlds
     *     tags: [Tour]
     *     requestBody:
     *       description: Optional request body
     *       required: false
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               authType:
     *                 type: string
     *               email:
     *                 type: string
     *               loginId:
     *                 type: string
     *               authPwd:
     *                 type: string
     *     responses:
     *       '200':
     *         description: Success response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *       '400':
     *         description: Bad Request
     */
    public popularTravleList = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.stringArrCheck(res, req.body, ['targetType'], false)
        ) as {
            targetType: string
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const travelList = await TravelService.getPopularTravleList(data.targetType);

            await this.resultInterpreter(req, res, travelList);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }



}



export default new TravelController();
