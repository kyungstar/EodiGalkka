
export enum userType {
    USER = 'USER',
    ADMIN = 'ADMIN',
    AGENCY = 'AGENCY',
}

export enum genderType {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

// 검증 데이터 모델
const userTypeSchema = {
    type: 'string',
    enum: Object.values(userType)
};

const loginIdSchema = {
    type: 'string',
    minLength: 8,
    maxLength: 12
};

const pwdSchema = {
    type: 'string'
};


const emailSchema = {
    type: 'string'
};

const userIdSchema = {
    type: 'string',
    minLength: 8,
    maxLength: 50,
    required: true,
};



const nameSchema = {
    type: 'string',
    required: true,
};

const nickNameSchema = {
    type: 'string',
    minLength: 1,
    maxLength: 6,
};

const phoneNumberSchema = {
    type: 'string',
    pattern: /^\d{3}-\d{4}-\d{4}$/,
};

const genderSchema = {
    type: 'string',
    enum: Object.values(genderType),
    required: true,
};

const addressSchema = {
    type: 'string',
    maxLength: 45,
};

const addressDetailSchema = {
    type: 'string',
    maxLength: 45,
};


// 스키마 예제
export const userJoinSchema = {
        type: 'object',
        properties: {
            userType: userTypeSchema,
            loginId: loginIdSchema,
            pwd: pwdSchema,
            email: emailSchema,
            name: {type: "string"},
            nickName: {type: "string"},
            phoneNumber: {type: "string"},
            gender: {type: "string"},
            address: {type: "string"},
            addressDetail: {type: "string"}
        },
        required: ["userType", "loginId", "pwd", "email", "name", "gender"],
};

export interface userJoinInterface {
    userType: string,
    loginId: string,
    pwd: string,
    email: string,
    name: string,
    nickName: string,
    phoneNumber: string,
    gender: string,
    address: string,
    addressDetail: string
};
