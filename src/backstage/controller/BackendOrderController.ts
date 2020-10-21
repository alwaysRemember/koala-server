/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-27 14:31:42
 * @LastEditTime: 2020-10-21 17:14:51
 * @FilePath: /koala-server/src/backstage/controller/BackendOrderController.ts
 */
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UsePipes,
} from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ResultVo } from 'src/global/viewobject/ResultVo';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { EBackendUserType } from '../enums/EBackendUserType';
import {
  IGetOrderListRequestParams,
  IOrderDetailRequestParams,
  IReturnOfGoodsRequestParams,
  IUpdateOrderLogisticsInfoRequestParams,
} from '../form/BackendOrderForm';
import {
  IGetOrderListResponse,
  IOrderDetailResponse,
  IUpdateOrderLogisticsInfoResponse,
} from '../interface/IOrder';
import {
  GetOrderDetailSchema,
  GetOrderListSchema,
  ReturnOfGoodsSchema,
  UpdateOrderLogisticsInfoSchema,
} from '../schema/BackendOrderSchema';
import { BackendOrderService } from '../service/BackendOrderService';
import { SetPermissionsForController } from '../utils';

@Controller('/order')
export class BackendOrderController {
  constructor(private readonly backendOrderService: BackendOrderService) {}

  /**
   * 获取订单列表
   * @param data
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetOrderListSchema, ({ type }) => type === 'body'),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/get-order-list')
  public async getOrderList(
    @Body() params: IGetOrderListRequestParams,
    @Req() { headers: { token } },
  ): Promise<ResultVo<IGetOrderListResponse>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.backendOrderService.getOrderList(params, token);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  // 获取订单详情
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetOrderDetailSchema, ({ type }) => type === 'body'),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/get-order-detail')
  public async getOrderDetail(
    @Body() { orderId }: IOrderDetailRequestParams,
    @Req() { headers: { token } },
  ): Promise<ResultVo<IOrderDetailResponse>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.backendOrderService.getOrderDetail(
        orderId,
        token,
      );
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      UpdateOrderLogisticsInfoSchema,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/update-order-logistics-info')
  public async updateOrderLogisticsInfo(
    @Body() params: IUpdateOrderLogisticsInfoRequestParams,
    @Req() { headers: { token } },
  ): Promise<ResultVo<IUpdateOrderLogisticsInfoResponse>> {
    const result = new ResultVoUtil();
    try {
      const data = await this.backendOrderService.updateOrderLogisticsInfo(
        params,
        token,
      );
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 申请微信退款
   * @param params
   * @param param1
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(ReturnOfGoodsSchema, ({ type }) => type === 'body'),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/return-of-goods')
  public async ReturnOfGoods(
    @Body() params: IReturnOfGoodsRequestParams,
    @Req() { headers: { token } },
  ) {
    const result = new ResultVoUtil();
    try {
      await this.backendOrderService.returnOfGoods(params.orderId, token);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }
}
