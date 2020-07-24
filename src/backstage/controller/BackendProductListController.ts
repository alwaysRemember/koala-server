/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-24 15:29:56
 * @LastEditTime: 2020-07-24 21:15:19
 * @FilePath: /koala-server/src/backstage/controller/BackendProductListController.ts
 */
import {
  Controller,
  HttpCode,
  UsePipes,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ProductListRequestParams } from '../schema/BackendProductListSchema';
import { SetPermissionsForController } from '../utils';
import { EBackendUserType } from '../enums/EBackendUserType';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { IProductListRequest } from '../interface/IProductList';
import { BackendProductService } from '../service/BackendProductService';

@Controller('/product-list')
export class BackendProductListController {
  constructor(private readonly backendProductService: BackendProductService) {}

  /**
   * 获取商品列表
   * @param params
   * @param param1
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(ProductListRequestParams, ({ type }) => type === 'body'),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/get-product-list')
  public async getProductList(
    @Body() params: IProductListRequest,
    @Req() { headers: { token } },
  ) {
    const result = new ResultVoUtil();
    try {
      const data = await this.backendProductService.getProductList(
        params,
        token,
      );
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
