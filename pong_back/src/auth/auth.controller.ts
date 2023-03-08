import { Controller,  Body, Get, Res, Req, Request, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FT_AuthGuard } from './utils/Guards';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('42/login')
    @UseGuards(FT_AuthGuard)
    handleLogin(){
        console.log('in login and req   is');
        return { msg: 'test1'};
    }

    @Get('42/redirect')
    @UseGuards(FT_AuthGuard)
    handleRedirect(@Res() res){
        console.log('res is ');
        console.log(res);
        res.redirect('http://localhost:8080/dashboard')
        return { msg: 'test'};
    }

    @Get('status')
    user(@Req() request: Request) {
        console.log(request);
    
    }
}

