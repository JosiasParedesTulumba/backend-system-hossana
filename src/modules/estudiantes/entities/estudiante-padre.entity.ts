import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Estudiante } from "./estudiante.entity";
import { Padre } from "src/modules/padres/entities/padre.entity";

@Entity('estudiante_padre')
export class EstudiantePadre {

    @PrimaryGeneratedColumn()
    estudiante_padre_id: number;

    @ManyToOne(() => Estudiante, estudiante => estudiante.estudiante_padres, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Padre, padre => padre.estudiante_padre, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'padre_id' })
    padre: Padre;
}