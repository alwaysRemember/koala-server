/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-05 15:33:48
 * @LastEditTime: 2020-08-13 15:00:46
 * @FilePath: /koala-server/src/frontend/exception/FrontException.ts
 */

import { SaveLogUtil } from 'src/utils/SaveLogUtil';
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 小程序错误实现
 */
export class FrontException extends HttpException {
  constructor(message: string, originalMessage?: string) {
    new SaveLogUtil({
      title: '*******FrontException*******',
      message,
      originalMessage:
        typeof originalMessage === 'string'
          ? originalMessage
          : JSON.stringify(originalMessage),
    }).saveError();
    super(message, HttpStatus.OK);
  }
}
