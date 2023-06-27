/**
 * Created By 강영규 On 2022-11-13
 */
import ResController from "../controller/ResController";


// 완전 개선 필요
class DataChecker extends ResController {


    // 토큰 꺼내기
    public loadJWTValue(objData: any) {
        return {
            userId: objData.userId,
            userType: objData.userType
        }
    }

    // 필수 값 검증
    public needArrCheck(res: any, objData: any, needArr: string[]) {

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
    }

    public numberArrCheck(res: any, objData: any, numberArr: string[], defaultValue: number, isRequire: boolean) {

        let retObj = {};
        let dataFailList = [];

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


    public fileCheck(res: any, objData: any, fileArr: string[], isRequire: boolean) {

        let retObj = {};
        let dataFailList = [];

        for (let item of fileArr) {

            console.log(objData[item]);

            if ((objData[item] == '' || objData[item] == undefined) && isRequire === true)
                dataFailList.push(item)

            // @ts-ignore
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