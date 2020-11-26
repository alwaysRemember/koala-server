/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:55:19
 * @LastEditTime: 2020-11-26 15:00:55
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
  GetProductCommentSchema,
  GetProductListSchema,
} from '../schema/FrontProductSchema';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import {
  IFavoriteProductType,
  IProductDetailResponse,
} from '../interface/IProduct';
import { ResultVo } from 'src/global/viewobject/ResultVo';
import {
  IGetProductCommentRequestParams,
  IGetProductListRequestParams,
} from '../form/IProduct';

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
  ): Promise<ResultVo<IProductDetailResponse>> {
    const result = new ResultVoUtil();
    const { openid } = req.headers;
    try {
      const product = await this.productService.getProductDetail(
        productId,
        openid,
      );
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
  public async favoriteProduct(
    @Body() data: IFavoriteProductType,
    @Req() req,
  ): Promise<ResultVo<{ favoriteType: boolean }>> {
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

  /**
   * 获取商品评价
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetProductCommentSchema, ({ type }) => type === 'body'),
  )
  @Post('/get-product-comment')
  public async getProductComment(
    @Body() { productId }: IGetProductCommentRequestParams,
  ) {
    const result = new ResultVoUtil();
    try {
      const data = await this.productService.getProductComment(productId);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取商品列表
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(GetProductListSchema, ({ type }) => type === 'body'),
  )
  @Post('/get-product-list')
  public async getProductList(@Body() params: IGetProductListRequestParams) {
    const result = new ResultVoUtil();

    try {
      const data = await this.productService.getProductList(params);
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
