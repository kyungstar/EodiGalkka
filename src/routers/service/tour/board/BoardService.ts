import DB from "../../../../modules/Mysql";
import QM from "../../../../modules/QueryMaker";
import ResultBox from "../../../dto/ResultBox";

export default class BoardService extends ResultBox {

    public static async boardWrite(countrySeq: number, title: string, contents: string, fileList: string[]) {

        try {

            const boardWriteResult = await DB.Executer(QM.Insert("t_board",{
                title: title,
                contents: contents,
                fileList: fileList
            }))

            if (boardWriteResult)
                return this.JustTrue('WS0');
            else
                return this.JustFalse('WF0');


        } catch (err) {
            return err;
        }
    }

}


