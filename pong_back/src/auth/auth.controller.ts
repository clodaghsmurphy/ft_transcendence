import { Controller,  Body, Get, UnauthorizedException, Res, Req, Request, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FT_AuthGuard } from './utils/Guards';
import { JwtAuthGuard } from './utils/JwtGuard';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { authenticator, totp } from 'otplib';
import *  as qrcode from 'qrcode';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UserService,
        private prisma: PrismaService) {}


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
        console.log(req.headers);
        return this.userService.get(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('generate')
    async generate(@Req() req, @Res() res: Response)
    {
        console.log(req.headers);
        const user = await this.userService.userExists(parseInt(req.user.id));
        if (!user)
            throw new UnauthorizedException();
        const secret = await user.otp_base32 || authenticator.generateSecret();
        console.log('secret is' );
        console.log(secret);
        const otpauth_url = authenticator.keyuri(req.user.name, 'transcendence', secret);
        const response = {
            secret: secret,
            uri: otpauth_url,
        };
        const updateUser = await this.prisma.user.update({
            where: {id: req.user.id},
            data: { otp_base32: secret,
                otp_auth_url: otpauth_url },
        });
        if (!updateUser)
            throw new UnauthorizedException();
        const code = await qrcode.toDataURL(otpauth_url);
        res.status(200).json({code});
        return {code};
    }

    @UseGuards(JwtAuthGuard)
    @Post('validate')
    async validate(@Body() body:any, @Req() req , @Res() res : Response){
        console.log(req.user);
        console.log(body.totp);
        const token = body.totp;
        const user = await this.userService.userExists(parseInt(req.user.id));
        if (!user)
            throw new UnauthorizedException();
        console.log(user);
        const secret = user.otp_base32;
        try {
            const isValid = authenticator.verify({ token, secret});
            console.log('isValid == ' + isValid);
            if (isValid == true)
            {
                const updateUser = await this.prisma.user.update({
                    where: {id: req.user.id},
                    data: { otp_enabled: true },
                });
            }
        } catch (e)
        {
            throw new UnauthorizedException();
        }
        return res.status(200).json({ msg: 'ok'});
    }
 
}

