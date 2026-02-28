import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";
import { CanalPago } from "../constants/canal-pago.enum";

export class CreateDetallesPagosDto {

    @Type(() => Number)
    @IsNotEmpty({ message: 'El pago es obligatorio' })
    @IsNumber({}, { message: 'El pago debe ser un número' })
    pagos_id: number;

    @Type(() => Number)
    @IsNotEmpty({ message: 'El padre es obligatorio' })
    @IsNumber({}, { message: 'El padre debe ser un número' })
    padre_id: number;

    @IsNotEmpty({ message: 'El canal de pago es obligatorio' })
    @IsEnum(CanalPago, {
        message: 'El canal de pago debe ser uno de los valores válidos',
    })
    canal_pago: CanalPago;

    @Type(() => Number)
    @IsNotEmpty({ message: 'El monto es obligatorio' })
    @IsNumber({}, { message: 'El monto debe ser un número válido' })
    @Min(0, { message: 'El monto no puede ser negativo' })
    monto: number;


}