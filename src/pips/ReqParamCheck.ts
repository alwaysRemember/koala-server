/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:14:52
 * @LastEditTime: 2020-06-15 16:24:53
 * @FilePath: /koala-background-server/src/pips/ReqParamCheck.ts
 */
import {
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import Joi from '@hapi/joi';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { BackendException } from 'src/exception/backendException';

/**
 * 参数前置校验
 */
export class ReqParamCheck implements PipeTransform {
  constructor(
    private readonly schema: Joi.ObjectSchema,
    private readonly toValidate = (metadate: ArgumentMetadata): boolean => true,
  ) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    // 类型校验
    if (!this.toValidate(metadata)) return value;

    // 参数校验
    try {
      await this.schema.validateAsync(value);
    } catch (e) {
      throw new BackendException(e.message);
    }
    return value;
  }
}
