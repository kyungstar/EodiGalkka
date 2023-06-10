import QM from "../../../modules/QueryMaker";
import DB from "../../../modules/Mysql";
import Logger from "../../../modules/Logger";

export default class SchedulerService {

    public static async updateTodayCount() {

        Logger.info("Today View Count Reset Start");

        const todayViewCountReset = await DB.Executer(QM.Update("t_travel", {today_view_cnt: 0}, {1: 1}));

        if(todayViewCountReset)
            Logger.info("Today View Count Reset Complete");
        else
            Logger.info("Today View Count Reset Fail");
    }

}

