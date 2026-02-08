import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiPeruService } from './api-peru.service';
import { ApiPeruController } from './api-peru.controller';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5
        })
    ],
    controllers: [ApiPeruController], 
    providers: [ApiPeruService],
    exports: [ApiPeruService],
    
})
export class ApiPeruModule { }
