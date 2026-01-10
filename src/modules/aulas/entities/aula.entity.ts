import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('aulas')
export class Aula {

    @PrimaryGeneratedColumn()
    aula_id:number;

    @Column('varchar',  {
        length: 100
    })
    nombre_aula:string;

}
