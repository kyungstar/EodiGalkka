import DB from "../../../../modules/Mysql";
import QM from "../../../../modules/QueryMaker";
import ResultBox from "../../../dto/ResultBox";

export default class CityService extends ResultBox {

    public static async cityList(countrySeq: number) {

        try {

            const cityList = await DB.getList(QM.Select("t_city", {
                country_seq: countrySeq
            }, {}, ["*"]) + ' ORDER BY order_num ASC');

            if (cityList)
                return this.ObjTrue('WN0', [{cityList: cityList}]);
            else
                return this.JustFalse('WN0');

        } catch (err) {
            return err;
        }
    }

}


