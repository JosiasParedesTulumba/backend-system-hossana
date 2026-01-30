import { IsDate, IsString } from "class-validator";

export class CreateEstudianteDto {
    @IsString({ message: 'El DNI debe ser una cadena de texto' })
    dni: string;

    @IsString({ message: 'Los nombres deben ser una cadena de texto' })
    nombres: string;

    @IsString({ message: 'El apellido paterno debe ser una cadena de texto' })
    apellido_paterno: string;

    @IsString({ message: 'El apellido materno debe ser una cadena de texto' })
    apellido_materno: string;

    @IsString({ message: 'El género debe ser una cadena de texto' })
    genero: string;

    @IsDate({ message: 'La fecha de nacimiento debe ser una fecha válida' })
    fecha_nacimiento: Date;

    @IsString({ message: 'El estado debe ser una cadena de texto (Activo o Inactivo)' })
    estado: string;
}
