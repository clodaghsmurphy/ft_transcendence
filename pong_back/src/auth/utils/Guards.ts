import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common'
import { Observable } from 'rxjs';

// auth guard acts middleman to validate request  before sending to router
@Injectable()
export class FT_AuthGuard extends AuthGuard('42')
{
    async canActivate(context: ExecutionContext) {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return activate;
    }
}