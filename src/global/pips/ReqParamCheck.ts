/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 15:14:52
 * @LastEditTime: 2020-07-07 18:12:41
 * @FilePath: /koala-server/src/global/pips/ReqParamCheck.ts
 */
import {
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import Joi from '@hapi/joi';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { BackendException } from 'src/backstage/exception/backendException';

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
