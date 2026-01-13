import { Aula } from "src/modules/aulas/entities/aula.entity";
import { Estudiante } from "src/modules/estudiantes/entities/estudiante.entity";
import { Padre } from "src/modules/padres/entities/padre.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EstadoMatricula } from "../constants/estado-matricula.enum";

@Entity('matriculas')
export class Matricula {

    @PrimaryGeneratedColumn()
    matricula_id: number;

    @ManyToOne(() => Estudiante, estudiante => estudiante.matricula )
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Aula, aula => aula.matricula)
    @JoinColumn({ name: 'aula_id' })
    aula: Aula;

    @ManyToOne(() => Padre, padre => padre.matricula )
    @JoinColumn({ name: 'padre_id' })
    padre_responsable: Padre;

    @Column({ type: 'date', nullable: false })
    fecha_matricula: Date;

    @Column({ 
        type: 'enum', 
        enum: EstadoMatricula, 
        default: EstadoMatricula.ACTIVO,
        enumName: 'estado_matricula_'
    })
    estado: EstadoMatricula;

    @Column({
        type: 'decimal', 
        precision: 10, 
        scale: 2, 
    })
    monto: number;

    @Column({ type: 'varchar', length: 50 })
    metodo_pago: string;

    @Column({ 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP' 
    })
    creado_en: Date;
}
