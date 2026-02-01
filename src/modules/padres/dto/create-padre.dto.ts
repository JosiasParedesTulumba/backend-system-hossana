import { TipoRelacion } from "../constants/tipo-relacion.enum";

export class CreatePadreDto {

    nombre: string;

    apellido: string;

    dni: string;

    telefono: string;

    email: string;

    direccion: string;

    tipo_relacion: TipoRelacion;
}
