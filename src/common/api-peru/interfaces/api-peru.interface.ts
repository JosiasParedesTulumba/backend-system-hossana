export interface ApiPeruDniResponse {
    success: boolean;
    data: ApiPeruDniData;
}

export interface ApiPeruDniData {
    numero: string;              // El DNI
    nombre_completo: string;     // Nombre completo
    nombres: string;             // Solo nombres
    apellido_paterno: string;    // Apellido paterno
    apellido_materno: string;    // Apellido materno
    codigo_verificacion: string; // Código de verificación
}