import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get('version')
    getHello() {
        return {
            version: "0.0.0"
        };
    }
}
