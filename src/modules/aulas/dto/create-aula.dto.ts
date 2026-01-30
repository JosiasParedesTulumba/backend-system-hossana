import { IsEnum, IsString } from "class-validator";
import { NivelEducativo } from "../constants/nivel-educativo.enum";

export class CreateAulaDto {

    @IsEnum({message: 'El nivel debe ser una cadena de texto'})
    nivel: NivelEducativo

    @IsString({message: 'El grado debe ser una cadena de texto'})
    grado: string

    @IsString({message: 'La seccion debe ser una cadena de texto'})
    seccion: string

}
