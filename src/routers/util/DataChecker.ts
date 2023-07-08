/**
 * Created By 강영규 On 2023-06-28
 */
import ResController from "../controller/ResController";


// DataChecker 클래스는 ResController 클래스를 상속받습니다.
// ResController는 다른 모듈에서 확장되는 기본 컨트롤러입니다.
class DataChecker extends ResController {


    // 토큰 꺼내기
    public loadJWTValue(objData: any) {

        // 전달받은 objData 객체에서 userId와 userType 값을 추출하여 반환합니다.
        return {
            userId: objData.userId,
            userType: objData.userType
        }
    }

    // 주어진 objData 객체의 숫자 형식 필드를 검사하는 함수입니다.
    // numberArr은 선택적으로 기본값이 있는 숫자 필드의 배열을,
    // numberNeedArr은 필수 숫자 필드의 배열을 나타냅니다.
    // defaultValue는 선택적 매개변수로, 필드가 필수가 아닌 경우에 사용되는 기본값을 나타냅니다.
    public numberCheck(res: any, objData: any, numberArr: string[], numberNeedArr: string[], defaultValue?: number) {

        let retObj: any = {};
        let dataFailList: string[] = [];

        for (const item of numberArr) {

            // 값이 필수가 아닐 경우, defaultValue를 셋팅합니다.
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

    // 주어진 objData 객체의 문자열 형식 필드를 검사하는 함수입니다.
    // strArr은 선택적으로 기본값이 있는 문자열 필드의 배열을,
    // strNeedArr은 필수 문자열 필드의 배열을 나타냅니다.
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

    // 주어진 objData 객체의 파일 필드를 검사하는 함수입니다.
    // fileArr은 파일 필드의 배열을,
    // isRequire는 해당 필드가 필수인지 여부를 나타냅니다.
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

    // 주어진 여러 개의 객체를 병합하는 함수입니다.
    // objList는 병합할 객체의 리스트를 나타냅니다.
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

//DataChecker 클래스의 인스턴스를 생성하고 해당 인스턴스를 모듈로 내보냅니다.
// export default 구문은 해당 모듈에서 기본적으로 내보낼 값을 지정합니다.
// > 예를 들어, 다른 파일에서 import DataChecker from './DataChecker';  사용하면 DataChecker 변수를 통해 해당 모듈에서 내보낸 DataChecker 클래스의 인스턴스에 접근할 수 있습니다.
export default new DataChecker();