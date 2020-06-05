/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 17:51:59
 * @LastEditTime: 2020-06-05 15:13:07
 * @FilePath: /koala-background-server/src/filters/BackendExceptionFilter.ts
 */
import { HttpExceptionFilter } from './HttpExceptionFilter';
import {
  HttpException,
  ArgumentsHost,
  Catch,
  HttpStatus,
} from '@nestjs/common';
import { BackendException } from 'src/exception/backendException';
import { Response, Request } from 'express';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { SaveLogUtil } from 'src/utils/SaveLogUtil';

@Catch(BackendException)
export class BackendExceptionFilter implements HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(HttpStatus.OK)
      .json(new ResultVoUtil().error(exception.message.replace(/\"/g, '')));
  }
}
