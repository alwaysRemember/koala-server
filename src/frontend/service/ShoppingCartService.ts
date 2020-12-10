import { Injectable } from '@nestjs/common';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { ShoppingCart } from 'src/global/dataobject/ShoppingCart.entity';
import { ProductConfigRepository } from 'src/global/repository/ProductConfigRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ShoppingCartRepository } from 'src/global/repository/ShoppingCartRepository';
import { reportErr } from 'src/utils/ReportError';
import { FrontException } from '../exception/FrontException';
import {
  IGetShoppingCartProductListRequestParams,
  ISaveProductToShoppingCartRequestParams,
} from '../form/IShoppingCart';
import { IProductListSqlResponseItem } from '../interface/IProduct';
import {
  IShoppingCartResponseData,
  IShoppingCartSqlResponseItem,
} from '../interface/IShoppingCart';
import { FrontUserService } from './UserService';

/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-27 15:12:09
 * @LastEditTime: 2020-12-10 10:24:10
 * @FilePath: /koala-server/src/frontend/service/ShoppingCartService.ts
 */
@Injectable()
export class ShoppingCartService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly userService: FrontUserService,
    private readonly productRepository: ProductRepository,
    private readonly productConfigRepository: ProductConfigRepository,
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

  /**
   * 删除当前的购物车产品
   * @param id
   * @param openid
   */
  async deleteProductForShoppingCart(idList: Array<string>, openid: string) {
    try {
      const user = await this.userService.findByOpenid(openid);
      let shoppingCartList: Array<ShoppingCart>;
      try {
        shoppingCartList = await this.shoppingCartRepository.findByIds(idList, {
          join: {
            alias: 'c',
            leftJoin: {
              user: 'c.user',
            },
          },
          where: {
            user,
          },
        });
      } catch (e) {
        await reportErr('查询当前产品信息失败', e);
      }
      if (!shoppingCartList.length) await reportErr('获取不到当前的产品');

      try {
        await this.shoppingCartRepository.remove(shoppingCartList);
      } catch (e) {
        await reportErr('删除当前产品失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 获取购物车列表
   * @param page
   * @param openid
   */
  async getShoppingCartProductList(
    page: number,
    openid: string,
  ): Promise<IShoppingCartResponseData> {
    const TAKE_NUM = 5;
    try {
      try {
        const user = this.userService.findByOpenid(openid);
        const db = this.shoppingCartRepository.createQueryBuilder('cart');

        db.leftJoinAndSelect('cart.product', 'product');
        db.leftJoinAndMapOne(
          'cart.productMainImg',
          ProductMainImg,
          'productMainImg',
          ' productMainImg.id = product.productMainImgId',
        );
        db.leftJoinAndMapOne(
          'cart.productDetail',
          ProductDetail,
          'productDetail',
          'productDetail.id = product.productDetailId',
        );
        db.andWhere(`cart.userUserId = ${(await user).userId}`);
        db.skip((page - 1) * TAKE_NUM)
          .take(TAKE_NUM)
          .addOrderBy('cart.createTime', 'DESC');
        const data = ((await db.getMany()) as unknown) as Array<
          IShoppingCartSqlResponseItem
        >;
        let total = await db.getCount();
        total = Math.ceil(total / TAKE_NUM);

        const productConfigList = await this.productConfigRepository.findByIds(
          data
            .map(item => item.buyProductConfigList)
            .reduce((p, c) => {
              return p.concat(c);
            }, []),
        );

        return {
          total,
          list: data.map(
            ({
              id: shoppingCartId,
              product: { id: productId, productName, productStatus },
              buyProductQuantity,
              buyProductConfigList,
              productDetail: { productAmount, productShipping },
              productMainImg: { path: productImg },
            }) => ({
              shoppingCartId,
              productId,
              name: productName,
              amount: productAmount,
              productShipping,
              productImg,
              buyQuantity: buyProductQuantity,
              productStatus,
              buyConfigList: buyProductConfigList.map(configId => {
                const {
                  id,
                  name,
                  categoryName,
                  amount,
                } = productConfigList.find(d => d.id === configId);
                return {
                  id,
                  name,
                  categoryName,
                  amount,
                };
              }),
            }),
          ),
        };
      } catch (e) {
        await reportErr('获取购物车信息失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
