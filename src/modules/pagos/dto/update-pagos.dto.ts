import { PartialType } from "@nestjs/mapped-types";
import { CreatePagosDto } from "./create-pagos.dto";

export class UpdatePagosDto extends PartialType(CreatePagosDto) {}