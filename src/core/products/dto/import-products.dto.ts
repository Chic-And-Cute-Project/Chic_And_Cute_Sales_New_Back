import { ApiProperty } from '@nestjs/swagger';

export class ImportProductsDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}