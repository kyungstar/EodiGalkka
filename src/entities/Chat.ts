import mongoose from "mongoose";
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";



@Entity()
export class chattingRoom {

    @PrimaryGeneratedColumn('uuid')
    chat_room_seq: number; // 변경된 user_id 데이터 타입

    @Column({
        type: "varchar",
        nullable: false
    })
    chat_room_name: string;


    // 채팅방 생성자
    @Column({
        type: "varchar",
        nullable: false
    })
    create_user_id: string;

    // 채팅방 생성일자
    @Column({
        type: "datetime", // DATETIME 형식 설정
        nullable: false
    })
    reg_date: Date; // Date 타입으로 수정

}


@Entity()
export class chatRoomMember {

    @PrimaryColumn({
        type: "uuid"
    })
    chat_room_seq: string;

    @PrimaryColumn({
        type: "varchar"
    })
    user_id: string;

    // 채팅방 생성일자
    @Column({
        type: "datetime",
        nullable: false
    })
    reg_date: Date;
}


