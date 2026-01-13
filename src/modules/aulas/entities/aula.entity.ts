import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NivelEducativo } from "../constants/nivel-educativo.enum";
import { MaterialAula } from "src/modules/materiales/entities/material-aula.entity";
import { Prestamo } from "src/modules/prestamos/entities/prestamo.entity";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";

@Entity('aulas')
export class Aula {

    @PrimaryGeneratedColumn()
    aula_id:number;

    @Column({
        type: 'enum',
        enum: NivelEducativo,
        enumName: 'nivel_educativo',    
        nullable: false
    })
    nivel:NivelEducativo;

    @Column({
        type: 'varchar',
        length: 50,
    })
    grado:string;

    @Column({
        type: 'varchar',
        length: 50,
    })
    seccion:string;

    @Column({
        type: 'varchar',
        length: 100,
    })
    nombre_personalizado:string;

    @OneToMany(() => MaterialAula, materialAula => materialAula.aula)
    material_aulas:MaterialAula[];

    @OneToMany(() => Prestamo, prestamo => prestamo.aula)
    prestamos: Prestamo[];

    @OneToMany(() => Matricula, matricula => matricula.aula)
    matricula: Matricula;
}
