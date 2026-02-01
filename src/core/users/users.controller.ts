import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param, ParseIntPipe,
    Post,
    Put,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {RegisterUserDto} from "./dto/register-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {ResetPasswordDto} from "./dto/reset-password.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.usersService.register(registerUserDto);
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    login(@Body() loginUserDto: LoginUserDto) {
        return this.usersService.login(loginUserDto);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    myObject(@Request() req: any) {
        return this.usersService.findById(req.user.id);
    }

    @Get()
    getAll() {
        return this.usersService.findAll();
    }

    @Get('roleBranch')
    getAllByBranchRole() {
        return this.usersService.findAllByBranchRole();
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    updateById(@Param('id', new ParseIntPipe({ exceptionFactory: () => new BadRequestException("El parametro debe ser un número") })) id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Get('name/:name')
    searchSales(@Param('name') name: string) {
        return this.usersService.searchUserSales(name);
    }

    @Put('reset-password')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.usersService.resetPassword(resetPasswordDto);
    }
}
