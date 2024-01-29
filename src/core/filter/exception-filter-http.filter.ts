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
import { Request, Response } from 'express';

@Catch()
export class ExceptionFilterHttp implements ExceptionFilter {
  private httpAdapter: AbstractHttpAdapter<any>;
  protected readonly logger = new Logger();

  constructor(private readonly _adapterHost: HttpAdapterHost) {
    this.httpAdapter = _adapterHost.httpAdapter;
  }

  public catch(exception: any, host: ArgumentsHost) {
    const contextHttp = host.switchToHttp();
    const response = contextHttp.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const resolver: any = exception;
      const status = 422;
      const body = resolver.getResponse();
      body.statusCode = status;
      return response.status(status).json(body);
    }

    const { status, body } = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      },
    };

    return response.status(status).json(body);
  }
}
