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


/**
 * @swagger
 * tags:
 *   name: Tour
 *   description: Tour APIs
 */

class TourController extends ResController {

    /**
     * @swagger
     * tags:
     *   - name: Tour
     *     description: Tour APIs
     */
    /**
     * @swagger
     * /api/tour/world/list:
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
    public world = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        try {

            const worldList = await WorldService.worldList();

            await this.resultInterpreter(req, res, worldList);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    /**
     * @swagger
     * tags:
     *   - name: Tour
     *     description: Tour APIs
     */
    /**
     * @swagger
     * /api/tour/continents/list:
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
    public continents = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [],["worldSeq"])
        ) as {
            worldSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const continentsList = await WorldService.continentsList(data.worldSeq);

            await this.resultInterpreter(req, res, continentsList);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    /**
     * @swagger
     * tags:
     *   - name: Tour
     *     description: Tour APIs
     */
    /**
     * @swagger
     * /api/tour/country/list:
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
    public country = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [],["continentsSeq"])
        ) as {
            continentsSeq: number
        };

        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const countryList = await CountryService.countryList(data.continentsSeq);

            await this.resultInterpreter(req, res, countryList);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }

    /**
     * @swagger
     * tags:
     *   - name: Tour
     *     description: Tour APIs
     */
    /**
     * @swagger
     * /api/tour/mod/country/list:
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
    public crawlerCountry = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, ["page"],["travelSeq"], 1),
            DataChecker.stringCheck(res, req.body, [],["targetKeyword", "sort"])
        ) as {
            travelSeq: number,
            targetKeyword: string,
            sort: string,
            page: number
        };


        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const countryList = await CrawlerService.crawlerList(data.travelSeq, data.targetKeyword, data.sort, data.page);

            await this.resultInterpreter(req, res, countryList);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


    /**
     * @swagger
     * tags:
     *   - name: Tour
     *     description: Tour APIs
     */
    /**
     * @swagger
     * /api/tour/city/list:
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
    public cityList = async (req: Request, res: Response) => {
        Logger.info("Call API - " + req.originalUrl);

        let data = DataChecker.mergeObject(
            DataChecker.numberCheck(res, req.body, [],["countrySeq"])
        ) as {
            countrySeq: number
        };


        if (typeof data == 'string') {
            return this.clientReqError(req, res, data);
        }

        try {

            const countryList = await CityService.cityList(data.countrySeq);

            await this.resultInterpreter(req, res, countryList);

        } catch (err) {
            await this.errInterpreter(req, res, err);
        }

    }


}


export default new TourController();
