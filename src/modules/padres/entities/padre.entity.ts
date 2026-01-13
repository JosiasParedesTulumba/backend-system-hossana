import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipoRelacion } from "../constants/tipo-relacion.enum";
import { EstudiantePadre } from "src/modules/estudiantes/entities/estudiante-padre.entity";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";

@Entity('padres')
export class Padre {

    @PrimaryGeneratedColumn()
    padre_id: number;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,    
    })
    nombre: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,    
    })
    apellido: string;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true,    
    })
    dni: string;
    
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,    
    })
    telefono: string;

    @Column({
        type: 'varchar',
        length: 200,
    })
    email: string;

    @Column({ type: 'text' })
    direccion: string;

    @Column({
        type: 'enum',
        enum: TipoRelacion,
        enumName: 'tipo_relacion_enum',
    })
    tipo_relacion: TipoRelacion;

    @Column({ type: 'varchar', length: 100, nullable: true })
    detalles_relacion: string;

    @OneToMany(() => EstudiantePadre, estudiantePadre => estudiantePadre.padre)
    estudiante_padre: EstudiantePadre[];

    @OneToMany(() => Matricula, matricula => matricula.padre_responsable)
    matricula: Matricula[];
}
