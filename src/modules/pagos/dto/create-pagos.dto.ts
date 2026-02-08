import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";
import { Concepto } from "../constants/concepto.enum";
import { CanalPago } from "../constants/canal-pago.enum";
import { Meses } from "../constants/meses.enum";

export class CreatePagosDto {

    @Type(() => Number)
    @IsNotEmpty({ message: 'El estudiante es obligatorio' })
    @IsNumber({}, { message: 'El estudiante debe ser un número' })
    estudiante_id: number;

    @Type(() => Number)
    @IsNotEmpty({ message: 'El aula es obligatoria' })
    @IsNumber({}, { message: 'El aula debe ser un número' })
    aula_id: number;

    @Type(() => Number)
    @IsNotEmpty({ message: 'La matrícula es obligatoria' })
    @IsNumber({}, { message: 'La matrícula debe ser un número' })
    matricula_id: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'El padre debe ser un número' })
    padre_id: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'La madre debe ser un número válido' })
    madre_id: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'El tutor debe ser un número válido' })
    tutor_id: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'El padre responsable debe ser un número' })
    padre_responsable_id: number;

    @IsNotEmpty({ message: 'El concepto es obligatorio' })
    @IsEnum(Concepto, {
        message: 'El concepto debe ser uno de los valores válidos',
    })
    concepto: Concepto;

    @IsNotEmpty({ message: 'El canal de pago es obligatorio' })
    @IsEnum(CanalPago, {
        message: 'El canal de pago debe ser uno de los valores válidos',
    })
    canal_pago: CanalPago;

    @IsNotEmpty({ message: 'El mes es obligatorio' })
    @IsEnum(Meses, {
        message: 'El mes debe ser uno de los valores válidos',
    })
    meses: Meses;

    @Type(() => Number)
    @IsNotEmpty({ message: 'El monto es obligatorio' })
    @IsNumber({}, { message: 'El monto debe ser un número válido' })
    @Min(0, { message: 'El monto no puede ser negativo' })
    monto: number;
}