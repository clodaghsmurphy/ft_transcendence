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
        console.log('in logout');
        await this.userService.checkUser(user.id);
        const updateUser = await this.prisma.user.update({
            where: {id: user.id},
            data: { otp_verified: false }
        });
        return updateUser;
    }

    @Get('42/redirect')
    @UseGuards(FT_AuthGuard)
    handleRedirect(@Req() req, @Res() res, @UserEntity() user){
        console.log(res);
        console.log('in 42 redriect');
        const token =  this.authService.login(res, user);
        if (user.otp_enabled && !user.otp_verified)
        {
            console.log('redirecting to 2fa and token is ' + token);
            token.then(token => {
                res.redirect(`http://localhost:8080/2fa?access_token=${token.access_token}`)
            });
            return ;
        }
        console.log('after login')
        token.then(token => {
            res.redirect(`http://localhost:8080/login?access_token=${token.access_token}`)
        });
        return ;    }

    @Get('status')
    user(@Req() request: Request) {
        console.log(request);
    
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        console.log('in profile');
        console.log(req.headers);
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
        console.log('secret is' );
        console.log(secret);
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
        console.log('toekn is ' + token);
        const user = await this.userService.userExists(parseInt(req.user.id));
        if (!user)
            throw new UnauthorizedException();
        console.log(user);
        const secret = user.otp_base32;

        console.log('token = ' + token + ' and secret is ' + secret);
        const isValid = authenticator.verify({ token, secret});
        console.log('isValid == ' + isValid);
        if (isValid == true)
        {
            const updateUser = await this.prisma.user.update({
                where: {id: req.user.id},
                data: { otp_enabled: true, otp_verified: true },
            });
            console.log(updateUser);
            return updateUser;
        }
        else
        {
            console.log('returning 401');
            throw new UnauthorizedException();
        }

    }

    @Post('auth2fa')
    @UseGuards(JwtAuthGuard)
    async authenticate2fa(@Request() request, @Body() body){
        console.log('in auth 2fa and bosy is ');
        console.log(body.value);
        const token = body.value;
        console.log(request.user);
        console.log('request is');
        const secret = request.user.otp_base32;
        console.log('token = ' + token + ' and secret is ' + secret);
        const isValid = authenticator.verify({ token, secret});
        console.log('isValid == ' + isValid);
            if (isValid == true)
            {
            const updateUser = await this.prisma.user.update({
                where: {id: request.user.id},
                data: { otp_verified: true }
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
        console.log('in didable');
        console.log(updateUser);
        return updateUser;
    }
 
}

