import { Aula } from "src/modules/aulas/entities/aula.entity";
import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";
import { Material } from "src/modules/materiales/entities/material.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadoPrestamo } from "../constants/estado-prestamo.enum";

@Entity('prestamos')
export class Prestamo {

    @PrimaryGeneratedColumn()
    prestamo_id: number;

    @ManyToOne(() => Material, material => material.prestamos, { 
        onDelete: 'CASCADE' 
    }) 
    material: Material;

    @ManyToOne(() =>  Estudiante, estudiante => estudiante.prestamo)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Aula, aula => aula.prestamos ,{
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'aula_id' })
    aula: Aula;

    @Column()
    cantidad: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_prestamo: Date;

    @Column({ type: 'timestamp', nullable: true })
    fecha_devolucion: Date;

    @Column({
        type: 'enum',
        enum: EstadoPrestamo,
        default: EstadoPrestamo.ACTIVO
    })
    estado: EstadoPrestamo;

}
