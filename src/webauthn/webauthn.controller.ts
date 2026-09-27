import {Body, Controller, Post, Request, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {WebauthnService} from "./webauthn.service";
import * as server from "@simplewebauthn/server";
import {JwtAuthGuard} from "../security/jwt-auth.guard";
import {ApiBearerAuth} from "@nestjs/swagger";
import {VerifyAuthenticationDto} from "./dto/verify-authentication.dto";

@Controller('webauthn')
export class WebauthnController {

    constructor(private readonly webauthnService: WebauthnService) {}

    @Post('register/options')
    registerOptions() {
        return this.webauthnService.generateRegistrationOptions();
    }

    @Post('register/verify')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    @UsePipes(new ValidationPipe({whitelist: true}))
    verifyRegistration(@Body() registrationResponseJSON: server.RegistrationResponseJSON, @Request() req: any) {
        return this.webauthnService.verifyRegistration(registrationResponseJSON, req.user.id);
    }

    @Post('authentication/options')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    authenticationOptions(@Request() req: any) {
        return this.webauthnService.generateAuthenticationOptions(req.user.id);
    }

    @Post('authentication/verify')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('jwt-auth')
    verifyAuthentication(@Body() verifyAuthenticationDto: VerifyAuthenticationDto, @Request() req: any) {
        return this.webauthnService.verifyAuthentication(verifyAuthenticationDto, req.user.id);
    }
}
