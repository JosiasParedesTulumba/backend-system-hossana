import { IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePrestamoDto {
  @IsNumber()
  material_id: number;

  @IsNumber()
  aula_origen_id: number;

  @IsNumber()
  aula_destino_id: number;

  @IsNumber()
  cantidad: number;

  @IsDateString()
  @IsOptional()
  fecha_devolucion_esperada?: string;
}