import { Controller,  Body, Get, UnauthorizedException, Res, Req, Request, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { FT_AuthGuard } from './utils/Guards';
import { JwtAuthGuard } from './utils/JwtGuard';
import { Jwt2faAuthGuard } from './utils/Jwt2faGuard';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';
import { authenticator, totp } from 'otplib';
import *  as qrcode from 'qrcode';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "@prisma/client";
import { UserEntity } from 'src/user/utils/user.decorator';


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
        //42 AuthGuard redirects here and redirects to 42/redirect
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async handleLogout(@Req () req, @UserEntity() user) {
        await this.userService.checkUser(user.id);
        const updateUser = await this.prisma.user.update({
            where: {id: user.id},
            data: { otp_verified: false, connected: false }
        });
        return updateUser;
    }

    @Get('42/redirect')
    @UseGuards(FT_AuthGuard)
    handleRedirect(@Req() req, @Res() res, @UserEntity() user){
        const token =  this.authService.login(res, user);
        if (user.otp_enabled && !user.otp_verified)
        {
            token.then(token => {
                res.redirect(`http://${process.env.HOSTNAME}:8080/2fa?access_token=${token.access_token}`)
            });
            return ;
        }
        
        token.then(token => {
            res.redirect(`http://${process.env.HOSTNAME}:8080/login?access_token=${token.access_token}`)
        });
        return ;    }

    @Get('status')
    user(@Req() request: Request) {
        console.log(request);
    
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return this.userService.get(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('generate')
    async generate(@Req() req, @Res() res: Response)
    {
        const user = await this.userService.userExists(parseInt(req.user.id));
        if (!user)
            throw new UnauthorizedException();
        const secret = await user.otp_base32 || authenticator.generateSecret();
        const otpauth_url = await user.otp_auth_url || authenticator.keyuri(req.user.id, 'transcendence', secret);
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
    async validate(@Body() body:any, @Req() req ){
        const token = body.totp;
        const user = await this.userService.userExists(parseInt(req.user.id));
        if (!user)
            throw new UnauthorizedException();
        const secret = user.otp_base32;

        const isValid = authenticator.verify({ token, secret});
        if (isValid == true)
        {
            const updateUser = await this.prisma.user.update({
                where: {id: req.user.id},
                data: { otp_enabled: true, otp_verified: true },
            });
            return updateUser;
        }
        else
        {
            throw new UnauthorizedException();
        }

    }

    @Post('auth2fa')
    @UseGuards(JwtAuthGuard)
    async authenticate2fa(@Request() request, @Body() body){
      
        const token = body.value;
        const secret = request.user.otp_base32;
        console.log('token is ', token, ' and secret is ', secret);
        const isValid = authenticator.verify({ token, secret});
            if (isValid == true)
            {
            const updateUser = await this.prisma.user.update({
                where: {id: request.user.id},
                data: { otp_verified: true, connected: true }
            });
            return this.authService.login(request, updateUser);
        }
            else
        {
                throw new UnauthorizedException('Invalid authentication code');
            }
    }

    @Post('disable2fa')
    @UseGuards(JwtAuthGuard)
    async disable(@Request() request, @Body() body)
    {
        const user = await this.userService.userExists(request.user.id);
        if (!user)
            throw new UnauthorizedException();
        const updateUser = await this.prisma.user.update({
            where: {id: request.user.id},
            data: { otp_enabled: false, otp_verified: false }
        });
        return updateUser;
    }
 
}

