import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common'

@Injectable()
export class FT_AuthGuard extends AuthGuard('42')
{
    async canActivate(context: ExecutionContext)
    {
        const activate = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
    }
}