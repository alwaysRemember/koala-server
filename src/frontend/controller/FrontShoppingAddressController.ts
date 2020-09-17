/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-09-14 15:19:42
 * @LastEditTime: 2020-09-17 15:05:14
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
import {
  AddShoppingAddressSchema,
  deleteShoppingAddressSchema,
} from '../schema/FrontShoppingAddressSchema';
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
      const list = await this.shoppingAddressService.getShoppingAddressList(
        openid,
      );
      return result.success(list);
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 删除收货地址
   * @param param0
   */
  @HttpCode(200)
  @UsePipes(
    new ReqParamCheck(
      deleteShoppingAddressSchema,
      ({ type }) => type === 'body',
    ),
  )
  @Post('/delete-shopping-address')
  public async deleteShoppingAddress(@Body() { id }: { id: number }) {
    const result = new ResultVoUtil();
    try {
      await this.shoppingAddressService.deleteShoppingAddress(id);
      return result.success();
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取默认地址
   * @param param0
   */
  @HttpCode(200)
  @Get('/get-default-shopping-address')
  public async getDefaultShoppingAddress(@Req() { headers: { openid } }) {
    const result = new ResultVoUtil();
    try {
      const address = await this.shoppingAddressService.getDefaultShoppingAddress(
        openid,
      );
      return result.success(address);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
