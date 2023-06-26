import DB from "../../../../modules/Mysql";
import QM from "../../../../modules/QueryMaker";
import ResultBox from "../../../dto/ResultBox";
import UserService from "../../user/UserService";

export default class BoardService extends ResultBox {


    public static async boardDetail(boardSeq: number) {

        try {


            const boardDetailList = await DB.get([

                UserService.getUserData(QM.Select("t_board", {board_seq: boardSeq}, {}, ["*"]), "i.*, j.nickname", ""),
                UserService.getUserData(QM.Select("t_board_reply", {board_seq: boardSeq}, {}, ["*"]), "i.*, j.nickname", ""),
                QM.Update("t_board", {view_cnt: '\\view_cnt + 1'}, {board_seq: boardSeq})
            ]);

            if (!boardDetailList)
                return this.JustFalse('WF0');

            const boardData = boardDetailList[0][0];
            const boardReplyList = boardDetailList[1];

            return this.ObjTrue('WS0', [{boardData: boardData, boardReplyList: boardReplyList}]);


        } catch (err) {
            return this.JustErr(err);
        }
    }

    public static async boardList(boardType: string, page: number) {

        try {

            const boardList = await DB.getList(
                QM.Select("t_board", {
                    board_type: boardType
                }, {}, ["board_seq", "user_id", "target_seq", "title", "fileList"])
                + QM.getPage(["board_seq"], page))

            if (boardList)
                return this.ObjTrue('WS0', [{boardList: boardList}]);
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

            const boardData = await DB.getOne(QM.Select("t_board", {board_seq: boardSeq, user_id: userId}, {}, ["*"]));

            if (!boardData)
                throw 'Is Not Your Board Data';

            const queryList = [];

            queryList.push(QM.Delete("t_board", {board_seq: boardSeq}));

            if (fileSeqList.length > 0)
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

    public static async boardLike(boardSeq: number, userId: string) {

        try {

            const boardData = await DB.getOne(QM.Select("t_board_like", {board_seq: boardSeq, user_id: userId}, {}, ["*"]));

            if (boardData)
                throw 'Already Board Like';


            const boardLikeResult = await DB.get([

                QM.Insert("t_board_like",{board_seq: boardSeq, user_id: userId}),
                QM.Update("t_board",{like_cnt: '\\IFNULL(like_cnt, 0) + 1'}, {board_seq: boardSeq}),
            ]);

            if (boardLikeResult)
                return this.JustTrue('WS0');
            else
                return this.JustFalse('WF0');

        } catch (err) {
            return err;
        }
    }

    public static async boardReply(boardSeq: number, userId: string, reply: string) {

        try {

            const boardData = await DB.getOne(QM.Select("t_board", {board_seq: boardSeq}, {}, ["*"]));

            if (!boardData)
                throw 'Not Exists Board';

            const boardMaxCount = await DB.getCount(QM.Select("t_board_reply",{board_seq: boardSeq},{}, ["IFNULL(MAX(order_num), 0) as count"]));

            const boardReplyResult = await DB.Executer(QM.Insert("t_board_reply",{board_seq: boardSeq, reply: reply, user_id: userId, order_num: boardMaxCount + 1}));

            if (boardReplyResult)
                return this.JustTrue('WS0');
            else
                return this.JustFalse('WF0');

        } catch (err) {
            return err;
        }
    }


    public static async boardReport(boardSeq: number, boardType: string, userId: string, reportContents: string, fileList: string[]) {

        try {

            const boardData = await DB.getOne(QM.Select("t_board", {board_seq: boardSeq}, {}, ["*"]));

            if (!boardData)
                throw 'Not Exists Board';


            const boardReportResult = await DB.get([

                QM.Insert("t_board_report",{
                    board_seq: boardSeq,
                    board_type: boardType,
                    report_contents: reportContents,
                    user_id: userId,
                    target_user_id: boardData.user_id,
                    file_list: fileList
                }),
                QM.Update("t_board",{report_cnt: '\\IFNULL(report_cnt, 0) + 1'}, {board_seq: boardSeq})
            ]);

            if (boardReportResult)
                return this.JustTrue('WS0');
            else
                return this.JustFalse('WF0');

        } catch (err) {
            return err;
        }
    }

}


