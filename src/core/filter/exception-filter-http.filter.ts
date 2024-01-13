import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionFilterHttp implements ExceptionFilter {
  private httpAdapter: AbstractHttpAdapter;
  protected readonly logger = new Logger();

  constructor(private readonly adapterHost: HttpAdapterHost) {
    this.httpAdapter = adapterHost.httpAdapter;
  }

  public catch(exception: any, host: ArgumentsHost) {
    const contextHttp = host.switchToHttp();
    const request = contextHttp.getRequest();
    const response = contextHttp.getResponse();
    this.httpAdapter.setHeader(response, 'X-Powered-By', 'VBSecurity');

    if (exception instanceof BadRequestException) {
      const resolver: any = exception;
      const status = 422;
      const body = resolver.getResponse();
      body.statusCode = status;
      return this.httpAdapter.reply(response, body, status);
    }
    const { status, body } =
      exception instanceof HttpException
        ? {
            status:
              exception.getStatus() === undefined ? 500 : exception.getStatus(),
            body: exception.getResponse(),
          }
        : {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().getTime(),
              message: exception.message,
              path: request.path,
            },
          };
    return this.httpAdapter.reply(response, body, status);
  }
}
