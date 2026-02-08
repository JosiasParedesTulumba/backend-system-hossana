import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ApiPeruDniResponse } from './interfaces/api-peru.interface';
import { DniResponseDto } from './dto/dni-response.dto';

@Injectable()
export class ApiPeruService {

    private readonly logger = new Logger(ApiPeruService.name);
    private readonly apiUrl = 'https://apiperu.dev/api';
    private readonly token: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.token = this.configService.getOrThrow<string>('APIPERU_TOKEN');
    }

    async getPersonaByDni(dni: string): Promise<DniResponseDto> {
        try {
            this.logger.log(`Consultando DNI: ${dni}`)

            const { data } = await firstValueFrom(
                this.httpService.post<ApiPeruDniResponse>(
                    `${this.apiUrl}/dni`,
                    { dni },
                    {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 5000,
                    },
                ),
            );

            if (!data.success) {
                throw new HttpException(
                    'No se puede consultar el DNI',
                    HttpStatus.BAD_REQUEST,
                );
            }

            const personaData = data.data;

            return {
                dni: personaData.numero,
                nombres: personaData.nombres,
                apellidoPaterno: personaData.apellido_paterno,
                apellidoMaterno: personaData.apellido_materno,
                nombreCompleto: personaData.nombre_completo,
                codigo_verificacion: personaData.codigo_verificacion,
            };
        } catch (error) {
            this.logger.error(`Error consultando DNI ${dni}:`, error.message);

            if (error.response?.status === 404) {
                throw new HttpException(
                    'DNI no encontrado en RENIEC',
                    HttpStatus.NOT_FOUND,
                );
            }

            if (error.response?.status === 401) {
                throw new HttpException(
                    'Token de API inválido o expirado',
                    HttpStatus.UNAUTHORIZED,
                );
            }

            if (error.response?.status === 400) {
                throw new HttpException(
                    'DNI inválido (debe tener 8 dígitos)',
                    HttpStatus.BAD_REQUEST,
                );
            }

            // Error genérico
            throw new HttpException(
                'Error al consultar DNI en el servicio externo',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
