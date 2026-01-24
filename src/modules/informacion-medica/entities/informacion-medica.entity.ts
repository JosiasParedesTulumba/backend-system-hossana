import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('informacion_medica')
export class InformacionMedica {

    @PrimaryGeneratedColumn()
    informacion_medica_id: number;

    @OneToOne(() => Estudiante, estudiante => estudiante.informacion_medica)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    condicion: string;

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true
    })
    Gravedad: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    descripcion: string;
}
