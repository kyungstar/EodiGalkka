import DB from "../../../../modules/Mysql";
import QM from "../../../../modules/QueryMaker";
import ResultBox from "../../../dto/ResultBox";

export default class BoardService extends ResultBox {



    public static async boardDetail(boardSeq: number) {

        try {


            const boardDetailList = await DB.get([

                QM.Select("t_board",{board_seq: boardSeq},{},["*"]),
                QM.Select("t_board_reply",{board_seq: boardSeq},{},["*"]),
            ]);

            // todo 수정작업 필요함

     /*       if (boardDetailList)
                return this.ObjTrue('WS0', boardList);
            else
                return this.JustFalse('WF0');
*/
        } catch (err) {
            return err;
        }
    }

    public static async boardList(boardType: string, page: number) {

        try {

            const boardList = await DB.getList(
                QM.Select("t_board", {
                board_type: boardType},{},["board_seq", "user_id", "board_type", "target_seq", "title"])
                + QM.getPage("board_seq", page))

            if (boardList)
                return this.ObjTrue('WS0', boardList);
            else
                return this.JustFalse('WF0');

        } catch (err) {
            return err;
        }
    }

    public static async boardWrite(userId: string, boardType: string, targetSeq: number, title: string, contents: string, fileList: string[]) {

        try {

            const boardWriteResult = await DB.Executer(QM.Insert("t_board", {
                user_id: userId,
                board_type: boardType,
                target_seq: targetSeq,
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

    public static async boardUpdate(boardSeq: number, userId: string, boardType: string, targetSeq: number, title: string, contents: string, fileList: string[]) {

        try {

            const boardUpdateResult = await DB.Executer(QM.Update("t_board", {
                user_id: userId,
                board_type: boardType,
                target_seq: targetSeq,
                title: title,
                contents: contents,
                fileList: fileList
            }, {
                board_seq: boardSeq
            }))

            if (boardUpdateResult)
                return this.JustTrue('WS0');
            else
                return this.JustFalse('WF0');

        } catch (err) {
            return err;
        }
    }

    public static async boardDelete(boardSeq: number, userId: string, fileSeqList: string[]) {

        try {

            const boardData = await DB.getOne(QM.Select("t_board",{board_seq: boardSeq, user_id: userId},{},["*"]));

            if(!boardData)
                throw 'Is Not Your Board Data';

            const queryList = [];

            queryList.push(QM.Delete("t_board", {board_seq: boardSeq}));

            if(fileSeqList.length > 0)
                queryList.push(QM.Delete("t_file", {file_seq: 'IN ( ' + fileSeqList + ')'}))

            const boardDeleteResult = await DB.get(queryList);

            if (boardDeleteResult)
                return this.JustTrue('WS0');
            else
                return this.JustFalse('WF0');

        } catch (err) {
            return err;
        }
    }

}


