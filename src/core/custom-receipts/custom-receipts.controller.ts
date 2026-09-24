import {Body, Controller, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
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
}
