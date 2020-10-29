/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-22 15:10:12
 * @LastEditTime: 2020-10-29 17:59:28
 * @FilePath: /koala-server/src/frontend/controller/FrontOrderController.ts
 */

import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ResultVo } from 'src/global/viewobject/ResultVo';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import {
  ICancelOrder,
  IConfirmOrder,
  ICreateOrderParams,
  IGetLogisticsInfoRequestParams,
  IGetOrderListRequestParams,
  IRefundCourierInfo,
  IReturnOfGoodsParams,
  ISubmitOrderCommentRequestParams,
} from '../form/IFrontOrder';
import {
  ICreateOrderResponse,
  IGetLogisticsInfoResponseData,
  IGetOrderListResponse,
  IGetOrderResponse,
} from '../interface/IFrontOrder';
import {
  CancelOrderSchema,
  ConfirmOrderSchema,
  CreateOrderSchema,
  GetLogiticsInfoSchema,
  GetOrderListSchema,
  GetOrderSchema,
  OrderPaymentSchema,
  RefundCourierInfoSchema,
  ReturnOfGoodsSchema,
  SubmitOrderComment,
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
  public async cancelOrder(
    @Body() { orderId }: ICancelOrder,
  ): Promise<ResultVo<null>> {
    const result = new ResultVoUtil();
    try {
      await this.orderService.cancelOrder(orderId);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 发起微信支付
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(OrderPaymentSchema, ({ type }) => type === 'body'),
  )
  @Post('/order-payment')
  public async orderPayment(
    @Body() { orderId }: { orderId: string },
  ): Promise<ResultVo<ICreateOrderResponse>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.orderService.orderPayment(orderId);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
  /**
   * 退货退款
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(ReturnOfGoodsSchema, ({ type }) => type === 'body'),
  )
  @Post('/return-of-goods')
  public async returnOfGoods(@Body() params: IReturnOfGoodsParams) {
    const result = new ResultVoUtil();
    try {
      await this.orderService.returnOfGoods(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(ConfirmOrderSchema, ({ type }) => type === 'body'),
  )
  @Post('/confirm-order')
  public async confirmOrder(@Body() params: IConfirmOrder) {
    const result = new ResultVoUtil();
    try {
      await this.orderService.confirmOrder(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 添加退货快递信息
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(RefundCourierInfoSchema, ({ type }) => type === 'body'),
  )
  @Post('/add-refund-courier-info')
  public async addRefundCourierInfo(@Body() params: IRefundCourierInfo) {
    const result = new ResultVoUtil();
    try {
      await this.orderService.addRefundCourierInfo(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取快递信息
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetLogiticsInfoSchema, ({ type }) => type === 'body'),
  )
  @Post('/get-logistics-info')
  public async getLogisticsInfo(
    @Body() { orderId }: IGetLogisticsInfoRequestParams,
  ): Promise<ResultVo<IGetLogisticsInfoResponseData | null>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.orderService.getLogisticsInfo(orderId);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 提交订单评价
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(SubmitOrderComment, ({ type }) => type === 'body'),
  )
  @Post('/submit-order-comment')
  public async submitOrderComment(
    @Body() params: ISubmitOrderCommentRequestParams,
  ) {
    const result = new ResultVoUtil();
    try {
      await this.orderService.submitOrderComment(params);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
