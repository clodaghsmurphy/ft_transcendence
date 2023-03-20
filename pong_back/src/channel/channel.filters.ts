import { ArgumentsHost, BadRequestException, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch()
export class BadRequestFilter extends BaseWsExceptionFilter {
	catch(exception: BadRequestException, host: ArgumentsHost) {
		const properError = new WsException(exception);
		super.catch(properError, host);
	}
}
