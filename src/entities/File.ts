import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Continents, Country} from "./Tour";


@Entity()
export class File {

    @PrimaryGeneratedColumn('uuid')
    file_seq: number; // 변경된 user_id 데이터 타입

    // 원본파일
    @Column({
        type: "varchar",
        nullable: false
    })
    target_type: string;

    // 원본파일
    @Column({
        type: "varchar",
        nullable: false
    })
    target_key: string;

    // 원본파일
    @Column({
        type: "varchar",
        nullable: false
    })
    file_path: string;


    // 썸네일
    @Column({
        type: "varchar",
        nullable: true
    })
    thumb_path: string;

    // 등록자 ID
    @Column({
        type: "varchar",
        nullable: false
    })
    user_id: string;

    // 파일 사이즈
    @Column({
        type: "varchar",
        nullable: false
    })
    file_size: string;

    @Column({
        type: "datetime", // DATETIME 형식 설정
        nullable: false
    })
    reg_date: Date; // Date 타입으로 수정

}