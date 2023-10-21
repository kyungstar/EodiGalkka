// src/entities/User.ts

import crypto from 'crypto-js';
import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn} from 'typeorm';
import {userType, genderType} from "../repositories/UserEntity";
import Config, {RUN_MODE} from "../../config";


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

    @Column()
    email: string;

    @Column({ name: 'phone_number', select: false }) // 민감한 정보는 선택적으로 선택하지 않도록 설정
    phoneNumber: string;

    @Column()
    name: string;

    @Column()
    nickname: string;

    @Column({
        type: 'enum',
        enum: genderType,
        default: null
    })
    gender: genderType;

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

    @CreateDateColumn()
    reg_date: Date;

}