import ResController from "../../../controller/ResController";
import DB from "../../../../modules/Mysql";
import QM from "../../../../modules/QueryMaker";
import ResultBox from "../../../dto/ResultBox";

import axios from 'axios';
import cheerio from 'cheerio';

export default class WorldService extends ResultBox {


    public static async countryList(continentsSeq: number) {

        try {

            const countryList = await DB.getList(QM.Select("t_country", {
                continents_seq: continentsSeq
            }, {}, ["*"]) + ' ORDER BY order_num ASC');

            if (countryList)
                return this.ObjTrue('WN0', [{continentsList: countryList}]);

            else
                return this.JustFalse('WN0');


        } catch (err) {
            return err;
        }
    }

}


