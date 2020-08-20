/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:55:19
 * @LastEditTime: 2020-08-20 17:27:21
 * @FilePath: /koala-server/src/frontend/controller/FrontProductController.ts
 */

import { Controller, HttpCode, Post, UsePipes, Body } from '@nestjs/common';
import { ProductService } from '../service/ProductService';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { GetProductDetailSchema } from '../schema/FrontProductSchema';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';

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
  public async getProductDeital(@Body() { productId }: { productId: string }) {
    const result = new ResultVoUtil();
    try {
      const product = await this.productService.getProductDetail(productId);
      return result.success(product);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
