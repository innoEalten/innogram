import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  async handleRequest<T>(request: Promise<T>) {
    try {
      const response = await request;
      return response;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (
          err.response?.status &&
          err.response.status >= 400 &&
          err.response.status < 500
        ) {
          throw new HttpException(
            typeof err.response.data === 'string'
              ? err.response.data
              : 'Client error',
            err.response.status,
          );
        }
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
