import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Situacion } from "../constants/situacion.enum";
import { Procedencia } from "../constants/procedencia.enum";
import { EstadoMatricula } from "../constants/estado-matricula.enum";
import { Type } from "class-transformer";

export class CreateMatriculaDto {

    @Type(() => Number)
    @IsNotEmpty({ message: 'El estudiante es obligatorio' })
    @IsNumber({}, { message: 'El estudiante debe ser un número' })
    estudiante_id: number;

    @Type(() => Number)
    @IsNotEmpty({ message: 'El aula es obligatoria' })
    @IsNumber({}, { message: 'El aula debe ser un número' })
    aula_id: number;

    @Type(() => Number)
    @IsNotEmpty({ message: 'El padre responsable es obligatorio' })
    @IsNumber({}, { message: 'El padre responsable debe ser un número' })
    padre_responsable_id: number;
    
    @IsNotEmpty({ message: 'La situación es obligatoria' })
    @IsEnum(Situacion, {
        message: 'La situación debe ser Ingresante, Promovido o Repitente',
    })
    situacion: Situacion;

    @IsNotEmpty({ message: 'La procedencia es obligatoria' })
    @IsEnum(Procedencia, {
        message: 'La procedencia debe ser Misma IE u Otra IE',
    })
    procedencia: Procedencia;

    @IsString({ message: 'La IE de procedencia debe ser texto' })
    ie_procedencia: string;

    @Type(() => Number)
    @IsNotEmpty({ message: 'La inscripción es obligatoria' })
    @IsNumber({}, { message: 'La inscripción debe ser un número válido' })
    @Min(0, { message: 'La inscripción no puede ser negativa' })
    inscripcion: number;

    @Type(() => Number)
    @IsNotEmpty({ message: 'La matrícula es obligatoria' })
    @IsNumber({}, { message: 'La matrícula debe ser un número válido' })
    @Min(0, { message: 'La matrícula no puede ser negativa' })
    matricula: number;

    @Type(() => Number)
    @IsNotEmpty({ message: 'La mensualidad es obligatoria' })
    @IsNumber({}, { message: 'La mensualidad debe ser un número válido' })
    @Min(0, { message: 'La mensualidad no puede ser negativa' })
    mensualidad: number;
}
