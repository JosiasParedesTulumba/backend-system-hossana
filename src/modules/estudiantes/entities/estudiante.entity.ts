import { Column, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MaterialEstudiante } from "src/modules/materiales/entities/material-estudiante.entity";
import { Prestamo } from "src/modules/prestamos/entities/prestamo.entity";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";
import { Genero } from "../constants/genero.enum";
import { Estado } from "../constants/estado.enum";
import { InformacionMedica } from "src/modules/informacion-medica/entities/informacion-medica.entity";
import { Pagos } from "src/modules/pagos/entities/pagos.entity";
import { EstudiantePadre } from "./estudiante-padre.entity";


@Entity('estudiantes')
export class Estudiante {

    @PrimaryGeneratedColumn()
    estudiante_id: number;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true
    })
    dni: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false
    })
    nombres: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false
    })
    apellido_paterno: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false
    })
    apellido_materno: string;

    @Column({
        type: 'enum',
        enum: Genero,
        enumName: 'Genero',
        nullable: false
    })
    genero: Genero;

    @Column({ name: 'fecha_nacimiento', type: 'date' })
    fecha_nacimiento: string;

    @Column({
        type: 'enum',
        enum: Estado,
        enumName: 'Estado',
        default: Estado.ACTIVO
    })
    estado: Estado;


    // @Column({ type: 'text' })
    // direccion: string;

    // @Column({ 
    //     type: 'varchar', 
    //     length: 20,
    //     nullable: false
    // })
    // telefono: string;

    // @Column({ type: 'varchar', length: 100 })
    // email: string;

    // @DeleteDateColumn({ type: 'timestamp', nullable: true })
    // deletedAt: Date;

    @OneToMany(() => MaterialEstudiante, materialEstudiante => materialEstudiante.estudiante)
    material_estudiantes: MaterialEstudiante[];

    @OneToMany(() => Prestamo, prestamo => prestamo.estudiante)
    prestamo: Prestamo[];

    @OneToMany(() => Matricula, matricula => matricula.estudiante)
    matricula: Matricula[];

    @OneToMany(() => Pagos, pagos => pagos.estudiante)
    pagos: Pagos[];

    @OneToOne(() => InformacionMedica, informacionMedica => informacionMedica.estudiante)
    informacion_medica: InformacionMedica[];

    @OneToMany(() => EstudiantePadre, estudiantePadre => estudiantePadre.estudiante)
    estudiante_padres: EstudiantePadre[];
}
