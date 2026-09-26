import {Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {WebauthnService} from "./webauthn.service";
import * as server from "@simplewebauthn/server";

@Controller('webauthn')
export class WebauthnController {

    constructor(private readonly webauthnService: WebauthnService) {
    }

    @Post('register/options')
    registerOptions() {
        return this.webauthnService.generateRegistrationOptions();
    }

    @Post('register/verify')
    @UsePipes(new ValidationPipe({whitelist: true}))
    verifyRegistration(@Body() registrationResponseJSON: server.RegistrationResponseJSON) {
        return this.webauthnService.verifyRegistration(registrationResponseJSON);
    }

    @Post('authentication/options')
    authenticationOptions() {
        return this.webauthnService.generateAuthenticationOptions();
    }

    @Post('authentication/verify')
    @UsePipes(new ValidationPipe({whitelist: true}))
    verifyAuthentication(@Body() authenticationResponseJSON: server.AuthenticationResponseJSON) {
        return this.webauthnService.verifyAuthentication(authenticationResponseJSON);
    }
}
