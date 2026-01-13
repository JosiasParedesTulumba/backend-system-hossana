import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiPeruService } from './api-peru.service';

@Module({
    imports: [HttpModule],
    providers: [ApiPeruService],
    exports: [ApiPeruService],
    
})
export class ApiPeruModule { }
