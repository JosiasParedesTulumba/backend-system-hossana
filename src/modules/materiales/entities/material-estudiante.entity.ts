import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Material } from "./material.entity";
import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";
import { EstadoMaterialEstudiante } from "../constants/estado-material-estudent.enum";

@Entity('materiales_estudiantes')
export class MaterialEstudiante {

    @PrimaryGeneratedColumn()
    material_estudiante_id: number;

    @ManyToOne(() => Material, material => material.material_estudiantes)
    @JoinColumn({ name: 'material_id' })
    material: Material;

    @ManyToOne(() => Estudiante, estudiante => estudiante.material_estudiantes)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @Column({ type: 'int', nullable: false })
    cantidad_asignada: number;

    @Column({
        type: 'enum',
        enum: EstadoMaterialEstudiante,
        default: EstadoMaterialEstudiante.ASIGNADO
    })
    estado: EstadoMaterialEstudiante;
}   