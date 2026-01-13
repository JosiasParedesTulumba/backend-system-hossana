import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PadresService } from './padres.service';
import { PadresController } from './padres.controller';
import { Padre } from './entities/padre.entity';
import { ApiPeruModule } from 'src/common/api-peru/api-peru.module';
import { Matricula } from '../matriculas/entities/matricula.entity';
import { EstudiantePadre } from '../estudiantes/entities/estudiante-padre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Padre, Matricula, EstudiantePadre]),
    ApiPeruModule
  ],
  controllers: [PadresController],
  providers: [PadresService],
})
export class PadresModule {}
