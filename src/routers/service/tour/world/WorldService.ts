import ResController from "../../../controller/ResController";
import DB from "../../../../modules/Mysql";
import QM from "../../../../modules/QueryMaker";
import ResultBox from "../../../dto/ResultBox";

export default class WorldService extends ResultBox {

    public static async worldList() {

        try {

            const worldList = await DB.getList(QM.Select("t_world", {}, {}, ["*"]) + ' ORDER BY order_num ASC');

            if (worldList)
                return this.ObjTrue('WN0', [{worldList: worldList}]);

             else
                return this.JustFalse('WN0');


        } catch (err) {
            return err;
        }
    }

    public static async continentsList(worldSeq: number) {

        try {

            const continentsList = await DB.getList(QM.Select("t_continents", {
                world_seq: worldSeq
            }, {}, ["*"]) + ' ORDER BY order_num ASC');

            if (continentsList)
                return this.ObjTrue('WN0', [{continentsList: continentsList}]);

            else
                return this.JustFalse('WN0');


        } catch (err) {
            return err;
        }
    }


}