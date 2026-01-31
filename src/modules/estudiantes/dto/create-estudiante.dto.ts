import { IsDateString, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateEstudianteDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    apellido: string;

    @IsNotEmpty()
    @IsString()
    dni: string;

    @IsDateString()
    @IsNotEmpty()
    fecha_nacimiento: string;

    @IsNotEmpty()
    @IsString()
    direccion: string;

    @IsNotEmpty()
    @IsString()
    telefono: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
