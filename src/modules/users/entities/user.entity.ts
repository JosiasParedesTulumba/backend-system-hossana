import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({
        name: 'nombre_usuario',
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false,
    })
    username: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    password: string;

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false,
    })
    email: string;
}
