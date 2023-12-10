
import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, AfterLoad} from 'typeorm';

import {userType, genderType} from "../repositories/UserEntity";
import mongoose from "mongoose";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string; // 변경된 user_id 데이터 타입

    @Column({
        type: 'enum',
        enum: userType,
        default: null
    })
    type: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    email: string;

    @Column({
            type: "varchar",
            name: 'phone_number',
            nullable: false
        })
    phoneNumber: string;


    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @Column()
    nickname: string;

    @Column({
        type: 'enum',
        enum: genderType,
        default: null
    })
    gender: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    address_detail: string;

}


@Entity()
export class UserLogin {
    @PrimaryGeneratedColumn('uuid')
    user_id: string; // 변경된 user_id 데이터 타입

    @Column()
    login_id: string;

    @Column()
    password: string;

    @Column()
    issue_temp: number;

    @CreateDateColumn()
    reg_date: Date;

}

const userSchema = new mongoose.Schema({
    name: {
        type: String,               // 문자열 타입
        required: [true, "User must type name"],   // 필수 속성, 빈 값이거나 없으면 에러
        unique: true               // 중복 방지, 동일한 이름의 사용자가 없도록 함
    },
    // 사용자 토큰
    token: {
        type: String               // 문자열 타입
    },
    // 온라인 상태 여부
    online: {
        type: Boolean,             // 불리언 타입
        default: false             // 기본값은 false, 사용자의 기본 온라인 상태는 오프라인
    }
})

// ChatUser 모델 생성 및 내보내기
module.exports = mongoose.model("ChatUser", userSchema);
