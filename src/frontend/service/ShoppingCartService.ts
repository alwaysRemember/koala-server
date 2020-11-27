import { Injectable } from '@nestjs/common';
import { ShoppingCart } from 'src/global/dataobject/ShoppingCart.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ShoppingCartRepository } from 'src/global/repository/ShoppingCartRepository';
import { reportErr } from 'src/utils/ReportError';
import { FrontException } from '../exception/FrontException';
import { ISaveProductToShoppingCartRequestParams } from '../form/IShoppingCart';
import { FrontUserService } from './UserService';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 15:12:09
 * @LastEditTime: 2020-11-27 15:47:07
 * @FilePath: /koala-server/src/frontend/service/ShoppingCartService.ts
 */
@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly userService: FrontUserService,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 添加至购物车
   * @param productId
   * @param openid
   */
  async saveProductToShoppingCart(
    {
      productId,
      buyQuantity,
      buyConfigList,
    }: ISaveProductToShoppingCartRequestParams,
    openid: string,
  ) {
    try {
      const user = await this.userService.findByOpenid(openid);
      try {
        const product = await this.productRepository.findOne(productId);
        if (!product) await reportErr('未查询到商品');
        const shoppingCart = new ShoppingCart();
        shoppingCart.user = user;
        shoppingCart.buyProductConfigList = buyConfigList;
        shoppingCart.buyProductQuantity = buyQuantity;
        shoppingCart.product = product;
        this.shoppingCartRepository.save(shoppingCart);
      } catch (e) {
        await reportErr('添加购物车失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
