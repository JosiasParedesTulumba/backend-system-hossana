import { PartialType } from "@nestjs/mapped-types";
import { CreateDetallesPagosDto } from "./create-detalles-pagos";

export class UpdateDetallesDto extends PartialType(CreateDetallesPagosDto) {}