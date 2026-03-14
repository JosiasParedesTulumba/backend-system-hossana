import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { MaterialTipo } from '../constants/material-tipo.enum';

export class CreateMaterialDto {
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString()
    nombre: string;

    @IsNotEmpty({ message: 'El tipo es requerido' })
    @IsEnum(MaterialTipo, { message: 'Tipo de material inválido' })
    tipo: MaterialTipo;

    @IsNotEmpty({ message: 'La cantidad total es requerida' })
    @IsNumber({}, { message: 'La cantidad total debe ser un número' })
    @Min(0, { message: 'La cantidad total no puede ser negativa' })
    cantidad_total: number;

    @IsNotEmpty({ message: 'La categoría es requerida' })
    @IsString()
    categoria: string;
}