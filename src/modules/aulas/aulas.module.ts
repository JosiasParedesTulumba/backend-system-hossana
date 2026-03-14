import { Module } from '@nestjs/common';
import { AulasService } from './aulas.service';
import { AulasController } from './aulas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from './entities/aula.entity';
import { MaterialAula } from '../materiales/entities/material-aula.entity';
import { Material } from '../materiales/entities/material.entity';
import { Matricula } from '../matriculas/entities/matricula.entity';
import { MaterialEstudiante } from '../materiales/entities/material-estudiante.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ Aula, MaterialAula, Material, Matricula, MaterialEstudiante ]),
  ],
  controllers: [AulasController],
  providers: [AulasService],
  exports: [AulasService],
})
export class AulasModule {}