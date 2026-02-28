import { Padre } from "src/modules/padres/entities/padre.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
// import { TipoPagador } from "../constants/tipo-pagador.enum";
import { CanalPago } from "../constants/canal-pago.enum";
import { Pagos } from "./pagos.entity";

@Entity('detalle_pagos')
export class DetallePagos {
    @PrimaryGeneratedColumn()
    detalle_id: number;

    // Relacion con el pago principal
    @ManyToOne(() => Pagos, pagos => pagos.detalle_pagos, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'pagos_id' })
    pago: Pagos;

    // Relacion con todos los padres posibles como pagadores
    @ManyToOne(() => Padre, (padre) => padre.pagos_padre, {
        nullable: true,
        onDelete: 'SET NULL'
    })
    @JoinColumn({ name: 'padre_id' })
    pagador: Padre;

    // @Column({
    //     type: 'enum',
    //     enum: TipoPagador,
    //     enumName: 'TipoPagador',
    //     nullable: false
    // })
    // tipo_pagador: TipoPagador;

    @Column({
        type: 'enum',
        enum: CanalPago,
        enumName: 'CanalPago',
        nullable: false
    })
    canal_pago: CanalPago;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    monto: number;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_pago: string;



}