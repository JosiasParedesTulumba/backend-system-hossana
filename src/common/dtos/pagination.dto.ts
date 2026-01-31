import { Type } from "class-transformer";
import { IsOptional, Min } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsOptional()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @Min(1)
    limit?: number;
}