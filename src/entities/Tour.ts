
import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from 'typeorm';

// todo  world, city, country, travel, continents 재정리 필요
@Entity()
export class World {
    @PrimaryGeneratedColumn('uuid')
    world_seq: number; // 변경된 user_id 데이터 타입

    @Column({
        type: "varchar",
        nullable: false
    })
    world_name: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    world_contents: string;

    @Column({
        type: "int",
        nullable: false,
        default: 0 // 기본값 0 설정
    })
    order_num: number;

}


@Entity()
export class Continents {
    @PrimaryGeneratedColumn('uuid')
    continents_seq: number; // 변경된 user_id 데이터 타입

    @Column({
        type: "varchar",
        nullable: false
    })
    continents_name: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    continents_contents: string;

    @Column({
        type: "int",
        nullable: false,
        default: 0 // 기본값 0 설정
    })
    order_num: number;

    @Column({
        type: "datetime", // DATETIME 형식 설정
        nullable: false
    })
    reg_date: Date; // Date 타입으로 수정

}


@Entity()
export class Country {
    @PrimaryGeneratedColumn('uuid')
    country_seq: number; // 변경된 user_id 데이터 타입

    @ManyToOne(() => Continents, Continents => Continents.continents_seq) // World 엔티티와의 관계 설정
    @JoinColumn() // 외래키 관계 설정
    continents_seq: Continents; // World 엔티티와 관련된 열

    @Column({
        type: "varchar",
        nullable: false
    })
    country_name: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    world_contents: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    contents: string;

    @Column({
        type: "int",
        nullable: false,
        default: 0 // 기본값 0 설정
    })
    order_num: number;

    @Column({
        type: "int",
        nullable: false,
        default: 0 // 기본값 0 설정
    })
    today_cnt: number;

    @Column({
        type: "datetime", // DATETIME 형식 설정
        nullable: false
    })
    reg_date: Date; // Date 타입으로 수정

}


// todo
@Entity()
export class City {
// # city_seq, country_seq, city_name, title, contents, order_num, today_cnt, reg_date, countrySeqCountrySeq
    @PrimaryGeneratedColumn('uuid')
    city_seq: number; // 변경된 user_id 데이터 타입

    @ManyToOne(() => Country, Country => Country.country_seq) // World 엔티티와의 관계 설정
    @JoinColumn() // 외래키 관계 설정
    country_seq: Continents; // World 엔티티와 관련된 열

    @Column({
        type: "varchar",
        nullable: false
    })
    country_name: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    world_contents: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    contents: string;

    @Column({
        type: "int",
        nullable: false,
        default: 0 // 기본값 0 설정
    })
    order_num: number;

    @Column({
        type: "int",
        nullable: false,
        default: 0 // 기본값 0 설정
    })
    today_cnt: number;

    @Column({
        type: "datetime", // DATETIME 형식 설정
        nullable: false
    })
    reg_date: Date; // Date 타입으로 수정

}

@Entity()
export class travel {


}

