import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { mock } from 'jest-mock-extended';
import { ExceptionFilterHttp } from '../exception-filter-http.filter';

interface MockResponse {
  status: jest.Mock;
  json: jest.Mock;
}

describe('ExceptionFilterHttp', () => {
  let exceptionFilter: ExceptionFilterHttp;
  let httpAdapterHost: HttpAdapterHost;

  beforeEach(() => {
    httpAdapterHost = mock<HttpAdapterHost>();
    exceptionFilter = new ExceptionFilterHttp(httpAdapterHost);
  });

  describe('catch', () => {
    it('should handle BadRequestException correctly', () => {
      const exception = new BadRequestException('Validation failed');
      const host = mock<ArgumentsHost>();
      const responseMock: MockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const expectedStatus = 422;
      const expectedBody = {
        error: 'Bad Request',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
      };

      responseMock.status.mockReturnValue(responseMock); // Para encadear chamadas de métodos
      responseMock.json.mockReturnValue(expectedBody);

      const switchToHttpMock = jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
      }) as any;
      host.switchToHttp = switchToHttpMock;

      exceptionFilter.catch(exception, host);

      expect(responseMock.status).toHaveBeenCalledWith(expectedStatus);
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: 'Validation failed',
        error: 'Bad Request',
      });
    });

    it('should handle HttpException correctly', () => {
      const exception = new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      const host = mock<ArgumentsHost>();
      const responseMock: MockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      };

      const expectedStatus = 500;
      const expectedBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      };

      responseMock.status.mockReturnValue(responseMock); // Para encadear chamadas de métodos
      responseMock.json.mockReturnValue(expectedBody);

      const switchToHttpMock = jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
      }) as any;
      host.switchToHttp = switchToHttpMock;

      exceptionFilter.catch(exception, host);

      expect(responseMock.status).toHaveBeenCalledWith(expectedStatus);
      expect(responseMock.json).toHaveBeenCalledWith({"message": "Internal Server Error", "statusCode": 500});
    });

    it('should handle generic exception correctly', () => {
      const exception = new Error('Unexpected error');
      const host = mock<ArgumentsHost>();
      const responseMock: MockResponse = {
        status: jest.fn(),
        json: jest.fn(),
      };


      const expectedStatus = 500;
      const expectedBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpected error',
      };

      responseMock.status.mockReturnValue(responseMock); // Para encadear chamadas de métodos
      responseMock.json.mockReturnValue(expectedBody);

      const switchToHttpMock = jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
      }) as any;
      host.switchToHttp = switchToHttpMock;

      exceptionFilter.catch(exception, host);

      expect(responseMock.status).toHaveBeenCalledWith(expectedStatus);
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unexpected error',
      });
    });

    it('should handle other exceptions correctly', () => {
      const exception = {} as any; // Simulating a non-HttpException
      const host = mock<ArgumentsHost>();
      const responseMock: MockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const expectedStatus = 500;
      const expectedBody = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: undefined,
      };

      responseMock.status.mockReturnValue(responseMock); // Para encadear chamadas de métodos
      responseMock.json.mockReturnValue(expectedBody);

      const switchToHttpMock = jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
      }) as any;
      host.switchToHttp = switchToHttpMock;

      exceptionFilter.catch(exception, host);

      expect(responseMock.status).toHaveBeenCalledWith(expectedStatus);
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: undefined,
      });
    });

    it('should undefined handle', () => {
      const exception = {} as any;
      const host = mock<ArgumentsHost>();
      const responseMock: MockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const expectedStatus = 500;
      const expectedBody = {
        statusCode: undefined,
        message: undefined,
      };

      responseMock.status.mockReturnValue(responseMock); // Para encadear chamadas de métodos
      responseMock.json.mockReturnValue(expectedBody);

      const switchToHttpMock = jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(responseMock),
      }) as any;
      host.switchToHttp = switchToHttpMock;

      exceptionFilter.catch(exception, host);

      expect(responseMock.status).toHaveBeenCalledWith(expectedStatus);
      expect(responseMock.json).toHaveBeenCalledWith({
        statusCode: 500,
        message: undefined,
      });
    });
  });
});
