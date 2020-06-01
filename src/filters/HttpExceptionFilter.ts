/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 18:35:18
 * @LastEditTime: 2020-05-28 19:21:13
 * @FilePath: /koala_background_server/src/filters/HttpExceptionFilter.ts
 */
import { ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ResultVo } from 'src/viewobject/ResultVo';
import { ResultVoStatus } from 'src/enums/ResultVoStatus';
import { sysErr } from 'src/config/LogConfig';

/**
 * 请求错误兜底
 */
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    sysErr.error(
      `token=${request.headers['Token']} \n 
        url=${request.path} \n
        params=${JSON.stringify(request.body)} \n 
        message=${exception.message}
      `,
    );

    response
      .status(HttpStatus.OK)
      .json(
        new ResultVo(ResultVoStatus.TOAST, null, '系统服务出错，请稍后重试'),
      );
  }
}
