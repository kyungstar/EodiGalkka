
// 유저타입명시
import crypto from "crypto-js";
import Config, {RUN_MODE} from "../../config";

export enum userType {
    USER = 'USER',
    ADMIN = 'ADMIN',
    AGENCY = 'AGENCY',
}

// 성별
export enum genderType {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
}

// 유저
const userTypeSchema = {
    type: 'string',
    enum: Object.values(userType)
};


// 로그인아이디
const loginIdSchema = {
    type: 'string',
    minLength: 8,
    maxLength: 12
};

// 비밀번호
const pwdSchema = {
    type: 'string'
};

// 이메일
const emailSchema = {
    type: 'string'
};

// 유저 아이디
const userIdSchema = {
    type: 'string',
    minLength: 8,
    maxLength: 50
};

// 고객명
const nameSchema = {
    type: 'string'
};

// 고객 닉네임
const nickNameSchema = {
    type: 'string',
    minLength: 1,
    maxLength: 6,
};


// 전화번호의 Format은 항상, 000-0000-000을 사용한다.
const phoneNumberSchema = {
    type: 'string',
    minLength: 8,
    maxLength: 13
};

const genderSchema = {
    type: 'string',
    enum: Object.values(genderType)
};

const addressSchema = {
    type: 'string',
    maxLength: 45,
};

const addressDetailSchema = {
    type: 'string',
    maxLength: 45,
};


// 회원가입
export const userJoinSchema = {
        type: 'object',
        properties: {
            userType: userTypeSchema,
            loginId: loginIdSchema,
            pwd: pwdSchema,
            email: emailSchema,
            name: nameSchema,
            nickName: nickNameSchema,
            phoneNumber: phoneNumberSchema,
            gender: genderSchema,
            address: addressSchema,
            addressDetail: addressDetailSchema
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


// 로그인
export const userLoginSchema = {
    type: 'object',
    properties: {
        loginId: loginIdSchema,
        pwd: pwdSchema,
    },
    required: ["loginId", "pwd"],
};

export interface userLoginInterface {
    loginId: string,
    pwd: string
};

export const userSchema = {
    type: 'object',
    properties: {
        userId: userIdSchema
    },
    required: ["userId"]
};

export interface userInterface {
    userId: string
};


