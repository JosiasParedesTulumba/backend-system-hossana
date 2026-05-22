import { Aula } from "src/modules/aulas/entities/aula.entity";
import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";
import { Material } from "src/modules/materiales/entities/material.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadoPrestamo } from "../constants/estado-prestamo.enum";

@Entity('prestamos')
export class Prestamo {

    @PrimaryGeneratedColumn()
    prestamo_id: number;

    @ManyToOne(() => Material, material => material.prestamos, { onDelete: 'CASCADE' })
    material: Material;

    @ManyToOne(() => Estudiante, estudiante => estudiante.prestamo)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Aula, aula => aula.prestamosOrigen, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'aula_origen_id' })
    aula_origen: Aula;

    @ManyToOne(() => Aula, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'aula_destino_id' })
    aula_destino: Aula;

    @Column()
    cantidad: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_prestamo: Date;

    @Column({ type: 'timestamp', nullable: true })
    fecha_devolucion: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    fecha_devolucion_esperada: Date | null;   

    @Column({ type: 'enum', enum: EstadoPrestamo, default: EstadoPrestamo.ACTIVO })
    estado: EstadoPrestamo;
}