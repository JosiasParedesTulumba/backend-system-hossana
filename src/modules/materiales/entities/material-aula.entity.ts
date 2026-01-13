import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./material.entity";
import { Aula } from "src/modules/aulas/entities/aula.entity";

@Entity('material_aula')
export class MaterialAula {

    @PrimaryGeneratedColumn()
    material_aula_id: number;

    @ManyToOne(() => Material, material => material.material_aulas)
    @JoinColumn({ name: 'material_id' })
    material: Material;

    @ManyToOne(() => Aula, aula => aula.material_aulas)
    @JoinColumn({ name: 'aula_id' })
    aula: Aula;

    @Column({ type: 'int', nullable: false })
    cantidad_asignada: number;
}