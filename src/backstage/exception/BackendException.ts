/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 17:49:46
 * @LastEditTime: 2020-06-04 19:08:54
 * @FilePath: /koala-background-server/src/exception/BackendException.ts
 */
import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * 后台错误实现
 */
export class BackendException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.OK);
  }
}
