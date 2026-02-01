import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { TipoRelacion } from "../constants/tipo-relacion.enum";

export class CreatePadreDto {

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
        message: 'Solo letras y espacios'
    })
    nombre: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
        message: 'Solo letras y espacios'
    })
    apellido: string;

    @IsString()
    @Matches(/^\d{8}$/, {
        message: 'El DNI debe tener 8 dígitos'
    })
    dni: string;

    @IsString()
    @Matches(/^\d{9}$/, {
        message: 'El teléfono debe tener 9 dígitos'
    })
    telefono: string;

    @IsEmail()
    email: string;

    @IsString()
    direccion: string;

    @IsEnum(TipoRelacion, {
        message: 'Tipo de relación inválido'
    })
    tipo_relacion: TipoRelacion;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    detalles_relacion?: string;
}
