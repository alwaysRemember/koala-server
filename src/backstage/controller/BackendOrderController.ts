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
import { IGetOrderListRequestParams } from '../form/BackendOrderForm';
import { IGetOrderListResponse } from '../interface/IOrder';
import { GetOrderListSchema } from '../schema/BackendOrderSchema';
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
}
