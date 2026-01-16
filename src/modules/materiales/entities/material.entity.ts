import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { MaterialTipo } from "../constants/material-tipo.enum";
import { MaterialAula } from "./material-aula.entity";
import { MaterialEstudiante } from "./material-estudiante.entity";
import { Prestamo } from "src/modules/prestamos/entities/prestamo.entity";

@Entity('materiales')
export class Material {

    @PrimaryGeneratedColumn()
    material_id: number;

    @Column({ type: 'varchar', length: 100 })
    nombre: string;

    @Column({
        type: 'enum',
        enum: MaterialTipo,
        enumName: 'material_tipo_enum',
    })
    tipo: MaterialTipo;
    
    @Column({ type: 'varchar' })
    cantidad_total: string;

    @Column({
        type: 'varchar'
    })
    categoria: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'  
    })
    creado_en: Date;

    @OneToMany(() => MaterialAula, materialAula => materialAula.material)
    material_aulas: MaterialAula[];

    @OneToMany(() => MaterialEstudiante, materialEstudiante => materialEstudiante.material)
    material_estudiantes: MaterialEstudiante[];

    @OneToMany(() => Prestamo, (prestamo) => prestamo.material)
    prestamos: Prestamo[];
}

