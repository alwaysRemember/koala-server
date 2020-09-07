/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:55:19
 * @LastEditTime: 2020-09-07 17:04:47
 * @FilePath: /koala-server/src/frontend/controller/FrontProductController.ts
 */

import {
  Controller,
  HttpCode,
  Post,
  UsePipes,
  Body,
  Req,
} from '@nestjs/common';
import { ProductService } from '../service/ProductService';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import {
  GetProductDetailSchema,
  FavoriteProductType,
} from '../schema/FrontProductSchema';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { IFavoriteProductType } from '../interface/IProduct';

@Controller('/front/product')
export class FrontProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 获取产品详情
   * @param param0 productId 产品id
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetProductDetailSchema, ({ type }) => type === 'body'),
  )
  @Post('/get-product-detail')
  public async getProductDeital(
    @Body() { productId }: { productId: string },
    @Req() req,
  ) {
    const result = new ResultVoUtil();
    const { openid } = req.headers;
    try {
      const product = await this.productService.getProductDetail(productId,openid);
      return result.success(product);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 收藏商品
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(FavoriteProductType, ({ type }) => type === 'body'),
  )
  @Post('favorite-product-type')
  public async favoriteProduct(@Body() data: IFavoriteProductType, @Req() req) {
    const result = new ResultVoUtil();
    const { openid } = req.headers;
    try {
      const { favoriteType } = await this.productService.favoriteProduct(
        data,
        openid,
      );
      return result.success({ favoriteType });
    } catch (e) {
      return result.error(e.message);
    }
  }
}
