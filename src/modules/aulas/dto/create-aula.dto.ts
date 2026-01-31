import { NivelEducativo } from "../constants/nivel-educativo.enum";

export class CreateAulaDto {
    nivel: NivelEducativo;
    grado?: string;
    seccion?: string;
    nombre_personalizado:string;
}
