import {
    Body,
    Controller,
    Get,
    Post, StreamableFile,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {CustomReceiptsService} from "./custom-receipts.service";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {CreateCustomReceiptDto} from "./dto/create-custom-receipt.dto";

@Controller('custom-receipts')
export class CustomReceiptsController {

    constructor(private readonly customReceiptsService: CustomReceiptsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() createCustomReceiptDto: CreateCustomReceiptDto) {
        return this.customReceiptsService.create(createCustomReceiptDto);
    }

    @Get()
    getAll() {
        return this.customReceiptsService.findAll();
    }

    @Get('excel')
    async generateExcel() {
        const generateExcelResponse = await this.customReceiptsService.generateExcel();

        return new StreamableFile(Buffer.from(generateExcelResponse.buffer), {
            disposition: `attachment; filename="Recibos.xlsx"`,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
    }
}
