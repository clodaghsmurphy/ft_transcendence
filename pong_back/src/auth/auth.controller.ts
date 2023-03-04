import { Controller,  Body, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @Get('/42/login')
    signout(){
        return this.authService.signout();
    }

    @Post('/42/redierct')
    login(@Body('code') code): Promise<any> {
        console.log(code);

        return code;
    }
}