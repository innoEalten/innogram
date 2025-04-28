import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  async handleRequest<T>(request: Promise<T>) {
    try {
      return await request;
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status) {
        const status = err.response.status;
        const message =
          typeof err.response.data === 'string'
            ? err.response.data
            : status >= 500
              ? 'Internal server error'
              : 'Client error';

        throw new HttpException(message, status);
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async post<T>(url: string, data: any) {
    return this.handleRequest(
      firstValueFrom(this.httpService.post<T>(url, data)),
    );
  }

  async get<T>(url: string) {
    return this.handleRequest(firstValueFrom(this.httpService.get<T>(url)));
  }
}
