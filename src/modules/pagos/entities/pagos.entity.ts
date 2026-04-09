import { Aula } from "src/modules/aulas/entities/aula.entity";
import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Concepto } from "../constants/concepto.enum";
import { CanalPago } from "../constants/canal-pago.enum";
import { Meses } from "../constants/meses.enum";
import { Padre } from "src/modules/padres/entities/padre.entity";
import { Estado_pago } from "../constants/estado.enum";
// import { TipoPagador } from "../constants/tipo-pagador.enum";
import { DetallePagos } from "./detalle-pagos.entity";

@Entity('pagos')
export class Pagos {
    @PrimaryGeneratedColumn()
    pagos_id: number ;

    // Relaciones

    @ManyToOne(() => Matricula, matricula => matricula.pagos)
    @JoinColumn({ name: 'matricula_id' })
    matricula: Matricula;


    @Column({
        type: 'enum',
        enum: Concepto,
        enumName: 'Concepto',
        nullable: false
    })
    concepto: Concepto;

    @Column({
        type: 'enum',
        enum: Meses,
        enumName: 'Meses',
        nullable: true
    })
    meses: Meses;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    monto_total: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    monto_pagado: number;

    @Column({
        type: 'enum',
        enum: Estado_pago,
        default: Estado_pago.DEUDA,
        enumName: 'Estado_pago'
    })
    estado: Estado_pago;

    // Relacion con detalle de pagos

    @OneToMany(() => DetallePagos, detallePagos => detallePagos.pago, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    detalle_pagos: DetallePagos[];



}