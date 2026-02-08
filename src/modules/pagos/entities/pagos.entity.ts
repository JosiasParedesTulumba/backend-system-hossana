import { Aula } from "src/modules/aulas/entities/aula.entity";
import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Concepto } from "../constants/concepto.enum";
import { CanalPago } from "../constants/canal-pago.enum";
import { Meses } from "../constants/meses.enum";
import { Padre } from "src/modules/padres/entities/padre.entity";
import { Estado_pago } from "../constants/estado.enum";
import { TipoPagador } from "../constants/tipo-pagador.enum";

@Entity('pagos')
export class Pagos {
    @PrimaryGeneratedColumn()
    pagos_id: number;

    // Relaciones

    @ManyToOne(() => Estudiante, estudiante => estudiante.pagos)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Matricula, matricula => matricula.pagos)
    @JoinColumn({ name: 'matricula_id' })
    matricula: Matricula;

    @ManyToOne(() => Aula, aula => aula.pagos)
    @JoinColumn({ name: 'aula_id' })
    aula: Aula;

    // Relacion con todos los padres posibles como pagadores

    @ManyToOne(() => Padre, (padre) => padre.pagos_padre, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'padre_id' })
    pagador: Padre;

    @Column({
        type: 'enum',
        enum: TipoPagador,
        enumName: 'TipoPagador',
        nullable: false
    })
    tipo_pagador: TipoPagador;

    @Column({
        type: 'enum',
        enum: Concepto,
        enumName: 'Concepto',
        nullable: false
    })
    concepto: Concepto;

    @Column({
        type: 'enum',
        enum: CanalPago,
        enumName: 'CanalPago',
        nullable: false
    })
    canal_pago: CanalPago;

    @Column({
        type: 'enum',
        enum: Meses,
        enumName: 'Meses',
        nullable: false
    })
    meses: Meses;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    monto: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_pago: string;

    @Column({
        type: 'enum',
        enum: Estado_pago,
        default: Estado_pago.PENDIENTE,
        enumName: 'Estado_pago'
    })
    estado: Estado_pago;


}