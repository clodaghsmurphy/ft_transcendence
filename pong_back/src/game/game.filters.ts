import { ArgumentsHost, BadRequestException, Catch, Logger } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";

@Catch()
export class BadRequestFilter extends BaseWsExceptionFilter {
	private logger = new Logger('Filter');

	catch(exception: BadRequestException, host: ArgumentsHost) {
		const properError = new WsException(exception);
		this.logger.error(JSON.stringify(properError));
		super.catch(properError, host);
	}
}
