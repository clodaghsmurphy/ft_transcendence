import { Controller,  Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get ('/')
    test(){
        return 'test';
    }
    @Post( 'signin')
    signin() {
        return 'login function';
    }

    @Get('signout')
    signout(){
        return 'signout';
    }
}