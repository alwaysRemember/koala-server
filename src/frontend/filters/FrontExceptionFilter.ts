/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 17:51:59
 * @LastEditTime: 2020-08-05 15:42:32
 * @FilePath: /koala-server/src/frontend/filters/FrontExceptionFilter.ts
 */
import { HttpExceptionFilter } from '../../global/filters/HttpExceptionFilter';
import {
  HttpException,
  ArgumentsHost,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { SaveLogUtil } from 'src/utils/SaveLogUtil';
import { FrontException } from '../exception/FrontException';

@Catch(FrontException)
export class FrontExceptionFilter implements HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    new SaveLogUtil({
      title: '*******FrontExceptionFilter*******',
      token: request.headers['token'] as string,
      body: JSON.stringify(request.body),
      originalUrl: request.originalUrl,
      message: exception.message,
    }).saveError();

    response
      .status(HttpStatus.OK)
      .json(new ResultVoUtil().error(exception.message.replace(/\"/g, '')));
  }
}
