/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 17:49:46
 * @LastEditTime: 2020-08-06 18:15:12
 * @FilePath: /koala-server/src/backstage/exception/backendException.ts
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { SaveLogUtil } from 'src/utils/SaveLogUtil';

/**
 * 后台错误实现
 */
export class BackendException extends HttpException {
  constructor(message: string, originalMessage?: string) {
    new SaveLogUtil({
      title: '*******BackendException*******',
      message,
      originalMessage:
        typeof originalMessage === 'string'
          ? originalMessage
          : JSON.stringify(originalMessage),
    }).saveError();
    super(message, HttpStatus.OK);
  }
}
