import { Controller,  Body, Get, Res, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FT_AuthGuard } from './utils/Guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('42/login')
    @UseGuards(FT_AuthGuard)
    handleLogin(){
        return { msg: 'test1'};
    }

    @Get('42/redirect')
    @UseGuards(FT_AuthGuard)
    handleRedirect(@Res() res){
        console.log(res);
        res.redirect('http://localhost:8080/dashboard')
        return { msg: 'test'};
    }
}