import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Min, ValidateIf } from "class-validator";
import { Concepto } from "../constants/concepto.enum";
import { Meses } from "../constants/meses.enum";

export class CreatePagosDto {

    @Type(() => Number)
    @IsNotEmpty({ message: 'La matrícula es obligatoria' })
    @IsNumber({}, { message: 'La matrícula debe ser un número' })
    matricula_id: number;

    @IsNotEmpty({ message: 'El concepto es obligatorio' })
    @IsEnum(Concepto, {
        message: 'El concepto debe ser uno de los valores válidos',
    })
    concepto: Concepto;

    @ValidateIf(o => o.concepto === Concepto.MENSUALIDAD)
    @IsNotEmpty({ message: 'El mes es obligatorio para mensualidad' })
    @IsEnum(Meses, {
        message: 'El mes debe ser uno de los valores válidos',
    })
    meses?: Meses;
    
    @Type(() => Number)
    @IsNumber({}, { message: 'El monto total debe ser un número válido' })
    @Min(0, { message: 'El monto total no puede ser negativo' })
    monto_total: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'El monto pagado debe ser un número válido' })
    @Min(0, { message: 'El monto pagado no puede ser negativo' })
    monto_pagado: number;

}