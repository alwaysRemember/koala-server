/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 17:49:46
 * @LastEditTime: 2020-07-07 19:08:28
 * @FilePath: /koala-server/src/backstage/exception/BackendException.ts
 */
import { HttpException, HttpStatus } from '@nestjs/common';
import { SaveLogUtil } from 'src/utils/SaveLogUtil';

/**
 * 后台错误实现
 */
export class BackendException extends HttpException {
  constructor(message: string) {
    new SaveLogUtil({
      title: '*******BackendException*******',
      message,
    }).saveError();
    super(message, HttpStatus.OK);
  }
}
