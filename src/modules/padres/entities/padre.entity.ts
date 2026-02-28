import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipoRelacion } from "../constants/tipo-relacion.enum";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";
import { Pagos } from "src/modules/pagos/entities/pagos.entity";
import { EstudiantePadre } from "src/modules/estudiantes/entities/estudiante-padre.entity";
import { DetallePagos } from "src/modules/pagos/entities/detalle-pagos.entity";
import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";

@Entity('padres')
export class Padre {

    @PrimaryGeneratedColumn()
    padre_id: number;

    @ManyToOne(() => Estudiante, estudiante => estudiante.padres)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;


    @Column({
        type: 'varchar',
        length: 20,
        unique: true,
        nullable: false,
    })
    dni: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,
    })
    nombres: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,
    })
    apellido_materno: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,
    })
    apellido_paterno: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    telefono: string;

    @Column({
        type: 'varchar',
        length: 200,
    })
    email: string;

    @Column({ type: 'text' })
    direccion: string;

    @Column({
        type: 'enum',
        enum: TipoRelacion,
        enumName: 'tipo_relacion_enum',
    })
    tipo_relacion: TipoRelacion;

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    detalles_relacion: string;

    @Column({ default: false })
    es_contacto_principal: boolean;

    @OneToMany(() => Matricula, (matricula) => matricula.padre_responsable)
    matriculas_como_responsable: Matricula[];

    // @OneToMany(() => Estudiante, (estudiante) => estudiante.padres)
    // estudiante: Estudiante[];


    //relaciones con pagos 

    @OneToMany(() => DetallePagos, (detallePagos) => detallePagos.pagador)
    pagos_padre: DetallePagos[];

    @OneToMany(() => EstudiantePadre, estudiantePadre => estudiantePadre.padre)
    estudiante_padre: EstudiantePadre[];
}
