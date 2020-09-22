/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:10:12
 * @LastEditTime: 2020-09-22 16:37:18
 * @FilePath: /koala-server/src/frontend/controller/FrontOrderController.ts
 */

import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ResultVo } from 'src/global/viewobject/ResultVo';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { ICreateOrderParams } from '../form/IFrontOrder';
import { ICreateOrderResponse } from '../interface/IFrontOrder';
import { CreateOrderSchema } from '../schema/FrontOrderSchema';
import { OrderService } from '../service/OrderService';

@Controller('/front/order')
export class FrontOrderController {
  constructor(private readonly orderService: OrderService) {}

  @HttpCode(200)
  @UsePipes(new ReqParamCheck(CreateOrderSchema, ({ type }) => type === 'body'))
  @Post('/create-order')
  public async createOrder(
    @Body() params: ICreateOrderParams,
    @Req() { headers: { openid } },
  ): Promise<ResultVo<ICreateOrderResponse>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.orderService.createOrder(params, openid);
      return result.success<ICreateOrderResponse>();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
