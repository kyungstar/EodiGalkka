
import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, AfterLoad} from 'typeorm';

import {userType, genderType} from "../repositories/UserEntity";


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

    @CreateDateColumn()
    reg_date: Date;

}