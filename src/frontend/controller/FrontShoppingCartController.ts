/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 15:10:15
 * @LastEditTime: 2020-11-30 16:06:58
 * @FilePath: /koala-server/src/frontend/controller/FrontShoppingCartController.ts
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
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import {
  IDeleteProductForShoppingCartRequestParams,
  IGetShoppingCartProductListRequestParams,
  ISaveProductToShoppingCartRequestParams,
} from '../form/IShoppingCart';
import {
  DeleteProductForShoppingCartSchema,
  GetShoppingCartProductListSchema,
  SaveProductToShoppingCartSchema,
} from '../schema/FrontShoppingCartSchema';
import { ShoppingCartService } from '../service/ShoppingCartService';

@Controller('/front/shopping-cart')
export class FrontShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  /**
   * 添加至购物车
   * @param params
   * @param param1
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      SaveProductToShoppingCartSchema,
      ({ type }) => type === 'body',
    ),
  )
  @Post('/save-product-to-shopping-cart')
  public async saveProductToShoppingCart(
    @Body() params: ISaveProductToShoppingCartRequestParams,
    @Req() { headers: { openid } },
  ) {
    const result = new ResultVoUtil();
    try {
      await this.shoppingCartService.saveProductToShoppingCart(params, openid);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 删除当前购物车产品（支持多个）
   * @param param0
   * @param param1
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      DeleteProductForShoppingCartSchema,
      ({ type }) => type === 'body',
    ),
  )
  @Post('/delete-product-for-shopping-cart')
  public async deleteProductForShoppingCart(
    @Body() { idList }: IDeleteProductForShoppingCartRequestParams,
    @Req() { headers: { openid } },
  ) {
    const result = new ResultVoUtil();
    try {
      await this.shoppingCartService.deleteProductForShoppingCart(
        idList,
        openid,
      );
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      GetShoppingCartProductListSchema,
      ({ type }) => type === 'body',
    ),
  )
  @Post('/get-shopping-cart-product-list')
  public async getShoppingCartProductList(
    @Body() { page }: IGetShoppingCartProductListRequestParams,
    @Req() { headers: { openid } },
  ) {
    const result = new ResultVoUtil();
    try {
      const data = await this.shoppingCartService.getShoppingCartProductList(
        page,
        openid,
      );
      return result.success(data);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
