import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne} from 'typeorm';


enum TargetType {
    Country = 'Country',
    City = 'City',
    Continent = 'Continent',
}

// 대분류 (아시아, 아프리카, 유럽, 아메리카 .. 등등)
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


// 중분류 (동남아시아, 중앙아시아,,  )
@Entity()
export class Continents {
    @PrimaryGeneratedColumn('uuid')
    continents_seq: number; // 변경된 user_id 데이터 타입

    @ManyToOne(() => World, world => world.world_seq) // World 엔티티와의 관계 설정
    @JoinColumn({
        name: "world_seq"
    }) // 외래키 관계 설정
    world: World; // World 엔티티와 관련된 열


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


// 나라 분류 (베트남, 대한민국, 일본,, )
@Entity()
export class Country {
    @PrimaryGeneratedColumn('uuid')
    country_seq: number; // 변경된 user_id 데이터 타입

    @ManyToOne(() => Continents, Continents => Continents.continents_seq) // World 엔티티와의 관계 설정
    @JoinColumn({
        name: "continents_seq"
    }) // 외래키 관계 설정
    continents: Continents; // World 엔티티와 관련된 열

    @Column({
        type: "varchar",
        nullable: false
    })
    country_name: string;


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
    today_view_cnt: number;

    @Column({
        type: "datetime", // DATETIME 형식 설정
        nullable: false
    })
    reg_date: Date; // Date 타입으로 수정

}



// 도시 분류 (베트남, 대한민국, 일본,, )
@Entity()
export class City {

    @PrimaryGeneratedColumn('uuid')
    city_seq: number; // 변경된 user_id 데이터 타입

    @ManyToOne(() => Country, Country => Country.country_seq) // World 엔티티와의 관계 설정
    @JoinColumn({
        name: "country_seq"
    }) // 외래키 관계 설정
    country: Country; // World 엔티티와 관련된 열

    @Column({
        type: "varchar",
        nullable: false
    })
    city_name: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    city_contents: string;

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
export class Travel {
    @PrimaryGeneratedColumn('uuid')
    travel_seq: number; // 변경된 user_id 데이터 타입

    @Column({
        type: 'enum',
        enum: TargetType,
        default: TargetType.Country,
        nullable: false,
    })
    target_type: TargetType;

    @Column({
        type: "int",
        nullable: false
    })
    target_key: number;

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
        type: "datetime", // DATETIME 형식 설정
        nullable: false
    })
    reg_date: Date; // Date 타입으로 수정

}

