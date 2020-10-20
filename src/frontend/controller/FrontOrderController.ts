/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:10:12
 * @LastEditTime: 2020-10-20 16:30:05
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
import {
  ICancelOrder,
  ICreateOrderParams,
  IGetOrderListRequestParams,
} from '../form/IFrontOrder';
import {
  ICreateOrderResponse,
  IGetOrderListResponse,
  IGetOrderResponse,
} from '../interface/IFrontOrder';
import {
  CancelOrderSchema,
  CreateOrderSchema,
  GetOrderListSchema,
  GetOrderSchema,
} from '../schema/FrontOrderSchema';
import { OrderService } from '../service/OrderService';

@Controller('/front/order')
export class FrontOrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * 创建订单
   * @param params
   * @param param1
   */
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
      return result.success<ICreateOrderResponse>(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 根据支付id获取订单
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(new ReqParamCheck(GetOrderSchema, ({ type }) => type === 'body'))
  @Post('/get-pay-order')
  public async getPayOrder(
    @Body() { payOrderId }: { payOrderId: string },
  ): Promise<ResultVo<IGetOrderResponse>> {
    const result = new ResultVoUtil();
    try {
      const list = await this.orderService.getPayOrder(payOrderId);
      return result.success({ orderList: list });
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取订单列表
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetOrderListSchema, ({ type }) => type === 'body'),
  )
  @Post('/get-order-list')
  public async getorderList(
    @Body() params: IGetOrderListRequestParams,
    @Req() { headers: { openid } },
  ): Promise<ResultVo<IGetOrderListResponse>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.orderService.getOrderList(params, openid);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 取消订单
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(new ReqParamCheck(CancelOrderSchema, ({ type }) => type === 'body'))
  @Post('/cancel-order')
  public async cancelOrder(@Body() { orderId }: ICancelOrder) {
    const result = new ResultVoUtil();
    try {
      await this.orderService.cancelOrder(orderId);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
