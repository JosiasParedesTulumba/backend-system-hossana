import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('materiales')
export class Materiale {

    @PrimaryGeneratedColumn()
    material_id: number;

    @Column({
        type: 'varchar',
        length: 100,
    })
    nombre: string;

    
}

