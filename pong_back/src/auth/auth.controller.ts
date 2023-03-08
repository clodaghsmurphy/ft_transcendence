import { Controller,  Body, Get, Res, Req, Request, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FT_AuthGuard } from './utils/Guards';
import { JwtAuthGuard } from './utils/JwtGuard';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService,
        private userService: UserService) {}

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
    console.log(req.user);
    const token =  this.authService.login(req.user);
    console.log('secret = ');
    console.log(jwtConstants.secret);
    console.log('token ');
    console.log(token);
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
        console.log('req user in profile is ');
        console.log(req.user);
        console.log(this.userService.get(req.user.name));
         
        return this.userService.get(req.user.name);
    }
}

