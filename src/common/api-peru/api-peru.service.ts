import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiPeruService {

    constructor(private readonly httpService: HttpService) { }

    private readonly apiUrl = 'https://apiperu.dev/api';

    async getPersonByDni(dni: string) {
        const token = process.env.APIPERU_TOKEN;
        if (!token) {
            throw new Error('APIPERU_TOKEN not found in environment variables');
        }

        try {
            const { data } = await firstValueFrom(
                this.httpService.post(
                    `${this.apiUrl}/dni`,
                    { dni },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    },
                ),
            );
            return data;
        } catch (error) {
            throw new Error(`Error fetching DNI data: ${error.message}`);
        }
    }
}
