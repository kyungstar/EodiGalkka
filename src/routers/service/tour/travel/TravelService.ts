import ResController from "../../../controller/ResController";
import DB from "../../../../modules/Mysql";
import QM from "../../../../modules/QueryMaker";
import ResultBox from "../../../dto/ResultBox";

import axios from 'axios';


export default class TravelService extends ResultBox {


    public static async getTravelList(targetSeq: number, targetType: string) {

        try {

            const travelList = await DB.getList(QM.Select("t_travel", {
                target_seq: targetSeq,
                target_type: targetType
            }, {}, ["*"]) + ' ORDER BY order_num ASC');

            if (travelList) {
                return this.ObjTrue('WN0', [{travelList: travelList}]);
            } else
                return this.JustFalse('WN0');


        } catch (err) {
            return err;
        }
    }


    public static async getPopularTravleList(targetType: string) {

        try {

            let selectObj = {};

            if(targetType === 'CITY')
                selectObj = {target_type: 'CITY'};
            else if(targetType === 'COUNTRY')
                selectObj = {target_type: 'COUNTRY'};

            const travelList = await DB.getList(QM.Select("t_travel", selectObj, {}, ["*"]) + ' ORDER BY order_num ASC');

            if (travelList) {
                return this.ObjTrue('WN0', [{travelList: travelList}]);
            } else
                return this.JustFalse('WN0');


        } catch (err) {
            return err;
        }
    }

}


