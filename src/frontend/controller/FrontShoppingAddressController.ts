/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:19:42
 * @LastEditTime: 2020-09-14 17:01:55
 * @FilePath: /koala-server/src/frontend/controller/FrontShoppingAddressController.ts
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import { ReqParamCheck } from 'src/global/pips/ReqParamCheck';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { IAddShoppingAddressParams } from '../form/ShoppingAddress';
import { AddShoppingAddressSchema } from '../schema/FrontShoppingAddressSchema';
import { ShoppingAddressService } from '../service/ShoppingAddressService';

@Controller('/front/shoppingAddress')
export class FrontShoppingAddressController {
  constructor(
    private readonly shoppingAddressService: ShoppingAddressService,
  ) {}

  /**
   * 新增/修改收货地址
   * @param params
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(AddShoppingAddressSchema, ({ type }) => type === 'body'),
  )
  @Post('/add-shopping-address')
  public async AddShoppingAddress(
    @Body() params: IAddShoppingAddressParams,
    @Req() { headers: { openid } },
  ) {
    const result = new ResultVoUtil();
    try {
      await this.shoppingAddressService.addShoppingAddress(params, openid);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取收货地址列表
   */
  @HttpCode(200)
  @Get('/get-shopping-address-list')
  public async getShoppingAddressList(@Req() { headers: { openid } }) {
    const result = new ResultVoUtil();
    try {
      const list = await this.shoppingAddressService.getShoppingAddressList(openid);
      return result.success(list);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
