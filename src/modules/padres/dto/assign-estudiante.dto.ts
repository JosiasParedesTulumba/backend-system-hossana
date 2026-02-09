import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignEstudianteDto {
    @IsNotEmpty({ message: 'El ID del estudiante es requerido' })
    @IsNumber({}, { message: 'El ID del estudiante debe ser un número' })
    estudiante_id: number;
}
