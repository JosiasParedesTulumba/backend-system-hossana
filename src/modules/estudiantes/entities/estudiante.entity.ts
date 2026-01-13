import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { EstudiantePadre } from "./estudiante-padre.entity";
import { MaterialEstudiante } from "src/modules/materiales/entities/material-estudiante.entity";
import { Prestamo } from "src/modules/prestamos/entities/prestamo.entity";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";

@Entity('estudiantes')
export class Estudiante {

    @PrimaryGeneratedColumn()
    estudiante_id: number;

    @Column({ 
        type: 'varchar', 
        length: 200,
        nullable: false
    })
    nombre: string;

    @Column({ 
        type: 'varchar', 
        length: 200,
        nullable: false
    })
    apellido: string;

    @Column({ 
        type: 'varchar', 
        length: 20, 
        unique: true    
    })
    dni: string;

    @Column({ name: 'fecha_nacimiento', type: 'date' })
    fecha_nacimiento: Date;

    @Column({ type: 'text' })
    direccion: string;

    @Column({ 
        type: 'varchar', 
        length: 20,
        nullable: false
    })
    telefono: string;

    @Column({ type: 'varchar', length: 100 })
    email: string;

    @OneToMany(() => EstudiantePadre, estudiantePadre => estudiantePadre.estudiante)
    estudiante_padres: EstudiantePadre[];

    @OneToMany(() => MaterialEstudiante, materialEstudiante => materialEstudiante.estudiante)
    material_estudiantes: MaterialEstudiante[];

    @OneToMany(() => Prestamo, prestamo => prestamo.estudiante)
    prestamo: Prestamo[];

    @OneToMany(() => Matricula, matricula => matricula.estudiante)
    matricula: Matricula[];
}
