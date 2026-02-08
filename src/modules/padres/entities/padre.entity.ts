import { Column, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipoRelacion } from "../constants/tipo-relacion.enum";
import { Matricula } from "src/modules/matriculas/entities/matricula.entity";
import { Pagos } from "src/modules/pagos/entities/pagos.entity";

@Entity('padres')
export class Padre {

    @PrimaryGeneratedColumn()
    padre_id: number;

    @Column({
        type: 'varchar',
        length: 20,
        unique: true, 
        nullable: false,   
    })
    dni: string;

    @Column({ 
        type: 'varchar',
        length: 200,
        nullable: false,    
    })
    nombres: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,    
    })
    apellido_materno: string;

    @Column({
        type: 'varchar',
        length: 200,
        nullable: false,    
    })
    apellido_paterno: string;
    
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

    @DeleteDateColumn({ type: 'timestamp', nullable: true })
    deletedAt: Date;

    @Column({ type: 'varchar', length: 100, nullable: true })
    detalles_relacion: string;

    @OneToMany(() => Matricula, (matricula) => matricula.padre)
    matriculas_como_padre: Matricula[];

    @OneToMany(() => Matricula, (matricula) => matricula.madre)
    matriculas_como_madre: Matricula[];

    @OneToMany(() => Matricula, (matricula) => matricula.tutor)
    matriculas_como_tutor: Matricula[];

    @OneToMany(() => Matricula, (matricula) => matricula.padre_responsable)
    matriculas_como_responsable: Matricula[];

    //relaciones con pagos 

    @OneToMany(() => Pagos, (pagos) => pagos.pagador)
    pagos_padre: Pagos[];
    
}
