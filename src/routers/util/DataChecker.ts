/**
 * Created By 강영규 On 2023-06-28
 */
import ResController from "../controller/ResController";
import Config from "../../../config";

class DataChecker extends ResController {

    // 폐기 예정
    public numberArrCheck(res: any, objData: any, numberArr: string[], defaultValue: number, isRequire: boolean) {

        let retObj = {};
        let dataFailList: string[] = [];

        for (let item of numberArr) {

            if ((objData[item] == '' || objData[item] == undefined) && isRequire === true)
                dataFailList.push(item)


            if ((objData[item] == '' || objData[item] == undefined) && isRequire === false)
                objData[item] = 1;

            // @ts-ignore
            retObj[item] = parseInt(objData[item]);

        }

        if (dataFailList.length > 0) {
            return dataFailList + ' Is Essential Data';
        }


        return retObj;
    }

    // 필수 값 검증
    public needArrCheck(res: any, objData: any, needArr: string[]) {


        try {

            let retObj = {};
            let dataFailList = [];


            for (let item of needArr) {


                if (objData[item] === undefined || objData[item] === "") {
                    dataFailList.push(item)
                }

                // @ts-ignore
                retObj[item] = objData[item];

            }

            if (dataFailList.length > 0) {
                return dataFailList + ' Is Essential Data';
            }


            return retObj;

        } catch (err) {
            return err;
        }

    }


    public stringArrCheck(res: any, objData: any, strArr: string[], isRequire: boolean) {

        let retObj = {};
        let dataFailList = [];

        for (let item of strArr) {

            if ((objData[item] == '' || objData[item] == undefined) && isRequire === true)
                dataFailList.push(item)

            // @ts-ignore
            retObj[item] = objData[item];

        }

        if (dataFailList.length > 0)
            return dataFailList + ' Is Essential Data';


        return retObj;

    }


    //------------------------------------------------------------


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

        for (const item of strArr) {

            if ((objData[item] === '' || objData[item] === undefined))
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