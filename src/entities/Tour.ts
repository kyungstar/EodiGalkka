
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany, CreateDateColumn, JoinColumn
} from 'typeorm';


@Entity()
export class world {
    @PrimaryGeneratedColumn('uuid')
    world_seq: number;

    @Column({
        type: "varchar",
        nullable: false,
    })
    world_name: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    world_contents: string;

    @Column({
        type: "integer",
        nullable: false,
    })
    order_num: number;

    @Column({
        type: "integer",
        nullable: false
    })
    today_cnt: number;

    @OneToMany(() => continents, continents => continents.world_seq)
    continents: continents[];

    @OneToMany(() => worldDetail, worldDetail => worldDetail.world_seq)
    worldDetails: worldDetail[];
}

@Entity()
export class worldDetail {
    @PrimaryGeneratedColumn('uuid')
    detail_seq: number;

    @ManyToOne(() => world, world => world.worldDetails, {
        onDelete: 'CASCADE', // 이 부분을 추가하면, 연관된 worldDetail 행이 삭제될 때 해당 world 행도 삭제됩니다.
    })
    @JoinColumn({ name: 'world_seq' })
    world_seq: world;

    @Column({
        type: "varchar",
        nullable: false,
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    contents: string;
}

@Entity()
export class continents {
    @PrimaryGeneratedColumn('uuid')
    continents_seq: number;

    @ManyToOne(() => world, world => world.continents)
    world_seq: world;

    @Column({
        type: "varchar",
        nullable: false,
    })
    continents_name: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    contents: string;

    @Column({
        type: "integer",
        nullable: false,
    })
    order_num: number;

    @Column({
        type: "integer",
        nullable: false
    })
    today_cnt: number;

    @OneToMany(() => country, country => country.continents_seq)
    country: country[];

}


@Entity()
export class country {
    @PrimaryGeneratedColumn('uuid')
    country_seq: number;

    @ManyToOne(() => continents, continents => continents.continents_seq)
    continents_seq: world;

    @Column({
        type: "varchar",
        nullable: false,
    })
    country_name: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    contents: string;

    @Column({
        type: "integer",
        nullable: false,
    })
    order_num: number;

    @Column({
        type: "integer",
        nullable: false
    })
    today_cnt: number;

    @CreateDateColumn()
    reg_date: Date;

    @OneToMany(() => city, city => city.city_seq)
    city: city[];
}

@Entity()
export class city {
    @PrimaryGeneratedColumn('uuid')
    city_seq: number;

    @ManyToOne(() => country, country => country.country_seq)
    country_seq: world;

    @Column({
        type: "varchar",
        nullable: false,
    })
    city_name: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    contents: string;

    @Column({
        type: "integer",
        nullable: false,
    })
    order_num: number;

    @Column({
        type: "integer",
        nullable: false
    })
    today_cnt: number;

    @CreateDateColumn()
    reg_date: Date;

}



@Entity()
export class travel {
    @PrimaryGeneratedColumn('uuid')
    travel_seq: number;

    @Column({
        type: "varchar",
        nullable: false,
    })
    title: string;

    @Column({
        type: "varchar",
        nullable: false,
    })
    contents: string;

    @Column({
        type: "integer",
        nullable: false,
    })
    order_num: number;

    @Column({
        type: "integer",
        nullable: false
    })
    today_view_cnt: number;

    @Column({
        type: "integer",
        nullable: false
    })
    total_view_cnt: number;

    @CreateDateColumn()
    reg_date: Date;

}