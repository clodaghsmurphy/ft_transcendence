import { Controller,  Body, Get, Res, Req, Request, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FT_AuthGuard } from './utils/Guards';
import { JwtAuthGuard } from './utils/JwtGuard';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import *  as qrcode from 'qrcode';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UserService) {}


    @Get('healthcheck')
    async test(@Res() res: Response){
        const response ={
            msg: 'auth wortking'
        };
        res.status(200).json(response);
    }
    @Get('42/login')
    @UseGuards(FT_AuthGuard)
    handleLogin(){
        console.log('in login and req   is');
        return { msg: 'test1'};
    }

    @Get('42/redirect')
    @UseGuards(FT_AuthGuard)
    handleRedirect(@Req() req, @Res() res){
    console.log('req.user is');
   
    const token =  this.authService.login(res, req.user);
    token.then(token => {
        console.log(token);
        res.redirect(`http://localhost:8080/login?access_token=${token.access_token}`)
    });
    }

    @Get('status')
    user(@Req() request: Request) {
        console.log(request);
    
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        console.log('In get profile and req is');
        console.log(req);
        console.log(req.user);
        console.log(this.userService.get(req.user.id));
         
        return this.userService.get(req.user.id);
    }

    @Post('generate')
    async generate(@Req() req: Request, @Res() res: Response)
    {
        const secret = authenticator.generateSecret();

        const otpauth_url = authenticator.keyuri('clmurphy', 'transcendence', secret);
        const response = {
            secret: secret,
            uri: otpauth_url,
        };
        console.log('url =- ' + otpauth_url);
    
        const code = await qrcode.toDataURL(otpauth_url);
        qrcode.toString('I am a pony!',{type:'terminal'}, function (err, url) {
            console.log(url)
          })
        console.log(code);
            res.header('Content-Type', 'image/png');
            res.send(code);
        //res.status(200).json(response);
    }

 
}

