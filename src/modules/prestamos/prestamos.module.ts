import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrestamosService } from './prestamos.service';
import { PrestamosController } from './prestamos.controller';
import { Prestamo } from './entities/prestamo.entity';
import { Material } from '../materiales/entities/material.entity';
import { MaterialAula } from '../materiales/entities/material-aula.entity';
import { Aula } from '../aulas/entities/aula.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Prestamo, Material, MaterialAula, Aula])],
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamosModule {}
