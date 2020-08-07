/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-24 15:29:56
 * @LastEditTime: 2020-08-07 14:55:51
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
import {
  ProductListRequestParams,
  productReviewRequestParams,
  getProductForProductIdParams,
} from '../schema/BackendProductListSchema';
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

  /**
   * 获取审核中的商品列表
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      productReviewRequestParams,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Post('/get-product-review-list')
  public async getPorductReviewList(
    @Body() params: { page: number; pageSize: number },
  ) {
    const result = new ResultVoUtil();
    try {
      const data = await this.backendProductService.getProductReviewList(
        params,
      );
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 根据产品id获取产品
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      getProductForProductIdParams,
      ({ type }) => type === 'body',
    ),
  )
  @SetPermissionsForController(EBackendUserType.ADMIN)
  @Post('/get-product-by-productId')
  public async getProductByProductId(
    @Body() { productId }: { productId: string },
  ) {
    const result = new ResultVoUtil();
    try {
      const list = await this.backendProductService.getProductByProductId(
        productId,
      );
      return result.success(list);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
