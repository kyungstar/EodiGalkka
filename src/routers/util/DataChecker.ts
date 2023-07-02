/**
 * Created By 강영규 On 2023-06-28
 */
import ResController from "../controller/ResController";
import Config from "../../../config";

class DataChecker extends ResController {


    // 토큰 꺼내기
    public loadJWTValue(objData: any) {
        return {
            userId: objData.userId,
            userType: objData.userType
        }
    }


    public numberCheck(res: any, objData: any, numberArr: string[], numberNeedArr: string[], defaultValue?: number) {

        let retObj: any = {};
        let dataFailList: string[] = [];

        for (const item of numberArr) {

            // 값이 필수가 아닐 경우, defaultValue를 셋팅한다.
            if ((objData[item] === '' || objData[item] === undefined))
                objData[item] = defaultValue;

            retObj[item] = parseInt(objData[item]);

        }

        for (const item of numberNeedArr) {

            if ((objData[item] === '' || objData[item] === undefined))
                dataFailList.push(item)

            retObj[item] = parseInt(objData[item]);

        }

        if (dataFailList.length > 0) {
            return dataFailList + ' Is Essential Data';
        }

        return retObj;

    }


    public stringCheck(res: any, objData: any, strArr: string[], strNeedArr: string[]) {

        let retObj: any = {};
        let dataFailList: string[] = [];

        for (const item of strArr) {

            retObj[item] = objData[item].toString();

        }

        for (const item of strNeedArr) {

            if ((objData[item] === '' || objData[item] === undefined || objData[item] === 'null'))
                dataFailList.push(item);

            retObj[item] = objData[item].toString();

        }


        if (dataFailList.length > 0)
            return dataFailList + ' Is Essential Data';

        return retObj;

    }


    public fileCheck(res: any, objData: any, fileArr: string[], isRequire: boolean) {

        let retObj: any = {};
        let dataFailList = [];

        for (let item of fileArr) {

            if ((objData[item] == '' || objData[item] == undefined) && isRequire === true)
                dataFailList.push(item)

            retObj[item] = objData[item];

        }

        if (dataFailList.length > 0)
            return dataFailList + ' Is Essential Data';


        return retObj;

    }

    public mergeObject(...objList: any[]) {
        let obj = {};

        for (let item of objList) {
            if (typeof item === "string") {
                return item;
            }

            Object.assign(obj, item);
        }

        return obj;

    }


}

export default new DataChecker();