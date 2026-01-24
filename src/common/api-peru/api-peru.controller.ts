import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiPeruService } from "./api-peru.service";

@Controller('api-peru')
export class ApiPeruController {

    constructor(
        private readonly apiPeruService: ApiPeruService,
    ) {}

    @Get('dni/:dni')
    async getPersonaByDni(@Param('dni') dni: string) {
        return await this.apiPeruService.getPersonaByDni(dni);
    }

}