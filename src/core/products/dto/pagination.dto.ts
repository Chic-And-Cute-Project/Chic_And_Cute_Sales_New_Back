import {IsInt, IsNotEmpty, Min} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
    @IsNotEmpty({ message: 'La página es obligatoria.' })
    @IsInt({ message: "La página debe ser un número." })
    @Type(() => Number)
    @Min(1, { message: "La página debe ser mínimo 1." })
    page: number;
}