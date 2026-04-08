import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInformacionMedicaDto {

    @IsNumber()
    estudiante_id: number;

    @IsString()
    condicion: string;

    @IsString()
    @IsOptional()
    tipo_condicion?: string;

    @IsString()
    @IsOptional()
    gravedad?: string;

    @IsString()
    @IsOptional()
    descripcion?: string;
}
