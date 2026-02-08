import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { NivelEducativo } from "../constants/nivel-educativo.enum";

export class CreateAulaDto {
    @IsNotEmpty({message: 'El nivel debe ser obligatorio'})
    @IsEnum(NivelEducativo, {message: 'El nivel debe ser Inicial, Primaria o Secundaria'})
    nivel: NivelEducativo

    @IsNotEmpty({message: 'El grado debe ser obligatorio'})
    @IsString({message: 'El grado debe ser una cadena de texto'})
    grado: string

    @IsNotEmpty({message: 'La seccion debe ser obligatorio'})
    @IsString({message: 'La seccion debe ser una cadena de texto'})
    seccion: string

}
