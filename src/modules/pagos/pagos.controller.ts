import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { MatriculasService } from '../matriculas/matriculas.service';
import { EstudiantesService } from '../estudiantes/estudiantes.service';
import { PadresService } from '../padres/padres.service';
import { AulasService } from '../aulas/aulas.service';
import { CreatePagosDto } from './dto/create-pagos.dto';
import { UpdatePagosDto } from './dto/update-pagos.dto';
import { NivelEducativo } from '../aulas/constants/nivel-educativo.enum';
import { CreateDetallesPagosDto } from './dto/create-detalles-pagos';
import { UpdateDetallesDto } from './dto/update-detalles.dto';
import { DetallePagos } from './entities/detalle-pagos.entity';

@Controller('pagos')
export class PagosController {

    constructor(
        private readonly pagosService: PagosService,
        private readonly estudiantesService: EstudiantesService,
        private readonly aulasService: AulasService,
        private readonly matriculasService: MatriculasService,
    ) { }

    @Get()
    findAll() {
        return this.pagosService.findAll();
    }

    @Get('detalle/pago/:id')
    findOneDetalle(@Param('id') id: string) {
        return this.pagosService.findDetallesByPago(+id)
    }

    @Get('estudiante/:id')
    getNombreEstudiante(
        @Param('id') id: string
    ): Promise<string> {
        return this.estudiantesService.getNombreEstudiante(+id);
    }

    @Get('aula/:id')
    async getNombreAula(@Param('id') id: string): Promise<string> {
        return await this.aulasService.getNombreAula(+id);
    }

    @Get('matricula/:codigo')
    findByCodigo(@Param('codigo') codigo: string) {
        return this.matriculasService.findByCodigo(codigo);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pagosService.findOne(+id)
    }

    @Post()
    async createPago(
        @Body() createPagosDto: CreatePagosDto
    ) {
        return await this.pagosService.createPagos(createPagosDto);
    }

    @Post('detalle/:id')
    async createDetalle(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateDetallesPagosDto
    ) {
        return this.pagosService.createDetalle({
            ...dto,
            pagos_id: id
        });
    }

    // @Post()
    // createPagos(@Body() createPagosDto: CreatePagosDto) {
    //     return this.pagosService.create(createPagosDto)
    // }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updatePagosDto: UpdatePagosDto
    ) {
        return this.pagosService.update(+id, updatePagosDto)
    }

    @Patch('detalle/:id')
    async updateDetalle(
        @Param('id') id: number,
        @Body() updateDetalleDto: UpdateDetallesDto
    ): Promise<DetallePagos> {
        return this.pagosService.updateDetalle(+id, updateDetalleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.pagosService.remove(+id)
    }

    @Delete('detalle/:id')
    removeDetalle(@Param('id') id: string) {
        return this.pagosService.removeDetalle(+id)
    }

}
