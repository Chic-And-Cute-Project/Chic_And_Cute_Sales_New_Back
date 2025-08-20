import {Body, Controller, Get, Post, Put, Query, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {UsersService} from "./users.service";
import {RegisterUserDto} from "./dto/register-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtAuthGuard} from "../../security/jwt-auth.guard";
import {ApiBearerAuth, ApiQuery} from "@nestjs/swagger";
import {UpdateUserDto} from "./dto/update-user.dto";
import {UpdateUserQueryDto} from "./dto/update-user-query.dto";
import {ResetPasswordDto} from "./dto/reset-password.dto";

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

    @Get('myObject')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    myObject(@Request() req: any) {
        return this.usersService.findById(req.user.id);
    }

    @Get('list')
    getAll() {
        return this.usersService.findAll();
    }

    @Get('getAllSales')
    getAllSales() {
        return this.usersService.findAllBySales();
    }

    @Get('searchSales')
    @ApiQuery({ name: 'name', type: String, required: true })
    searchSales(@Query('name') name: string) {
        return this.usersService.searchUserSales(name);
    }

    @Put()
    @ApiQuery({ name: 'id', type: Number, required: true })
    @UsePipes(new ValidationPipe({ whitelist: true }))
    update(@Query() query: UpdateUserQueryDto, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(query.id, updateUserDto);
    }

    @Put('reset-password')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.usersService.resetPassword(resetPasswordDto);
    }
}
