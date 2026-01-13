import { Module } from '@nestjs/common';
import { MaterialesService } from './materiales.service';
import { MaterialesController } from './materiales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialAula } from './entities/material-aula.entity';
import { MaterialEstudiante } from './entities/material-estudiante.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Material, MaterialAula, MaterialEstudiante ]),
  ],
  controllers: [MaterialesController],
  providers: [MaterialesService],
})
export class MaterialesModule {}
