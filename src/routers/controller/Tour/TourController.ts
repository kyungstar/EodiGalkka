import {Request, Response} from "express";


import Logger from "../../../modules/middlewares/Logger";
import DataValiator from "../../../service/DataValiator";
import {} from "../../../repositories/TourEntity";
import ResHandler from "../ResHandler";
import TourService from "../../../service/tour/TourService";
import UserService from "../../../service/user/UserService";


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

    public earthDetail = async (req: Request, res: Response) => {

        try {

            await TourService.getEarthDetail();

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public worldList = async (req: Request, res: Response) => {

        try {

            await TourService.getWorldList();

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


    public worldDetail = async (req: Request, res: Response) => {

        try {

            await TourService.getWorldDetail();

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public countryList = async (req: Request, res: Response) => {

        try {

            await TourService.getCountryList();

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }

    public countryDetail = async (req: Request, res: Response) => {

        try {

            await TourService.getCountryDetail();

        } catch (err) { // 유효성 검사 에러
            this.err(err, res);
        }

    }


}


export default new TourController();
