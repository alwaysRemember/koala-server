/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 18:35:18
 * @LastEditTime: 2020-06-05 18:58:00
 * @FilePath: /koala-background-server/src/filters/HttpExceptionFilter.ts
 */
import {
  ExceptionFilter,
  HttpStatus,
  Catch,
  HttpException,
} from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ResultVo } from 'src/viewobject/ResultVo';
import { EResultVoStatus } from 'src/backstage/enums/EResultVoStatus';
import { Request, Response } from 'express';
import { SaveLogUtil } from 'src/utils/SaveLogUtil';
import { Mail } from 'src/utils/Mail';

/**
 * 请求错误兜底
 */
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    new SaveLogUtil({
      title: '*******httpExceptionFilter*******',
      token: request.headers['token'] as string,
      body: JSON.stringify(request.body),
      originalUrl: request.originalUrl,
      message: exception.message,
    }).saveError();

    new Mail('KOALA - ERROR - CODE', {
      token: request.headers['token'] as string,
      body: JSON.stringify(request.body),
      originalUrl: request.originalUrl,
      message: exception.message,
      header: JSON.stringify(request.headers),
      exception: JSON.stringify(exception),
    }).send();

    response
      .status(HttpStatus.OK)
      .json(
        new ResultVo(EResultVoStatus.TOAST, null, '系统服务出错，请稍后重试'),
      );
  }
}
