import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Genero } from "../constants/genero.enum";
import { Estado } from "../constants/estado.enum";
import { Type } from "class-transformer";

export class CreateEstudianteDto {
    @IsString({ message: 'El DNI debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El DNI es obligatorio' })
    dni: string;

    @IsString({ message: 'Los nombres deben ser una cadena de texto' })
    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    nombres: string;

    @IsString({ message: 'El apellido paterno debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El apellido paterno es obligatorio' })
    apellido_paterno: string;

    @IsString({ message: 'El apellido materno debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El apellido materno es obligatorio' })
    apellido_materno: string;

    @IsEnum(Genero, { message: 'El género debe ser una cadena de texto' })
    genero: Genero;

    @IsDateString({},{ message: 'La fecha de nacimiento debe ser una fecha válida' })
    @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
    fecha_nacimiento: string;
}
