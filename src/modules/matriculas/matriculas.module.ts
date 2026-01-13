import { Module } from '@nestjs/common';
import { MatriculasService } from './matriculas.service';
import { MatriculasController } from './matriculas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Matricula } from './entities/matricula.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Matricula])
  ],
  controllers: [MatriculasController],
  providers: [MatriculasService],
})
export class MatriculasModule {}
