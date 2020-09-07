/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:58:44
 * @LastEditTime: 2020-09-07 17:18:24
 * @FilePath: /koala-server/src/frontend/service/ProductService.ts
 */

import { Injectable } from '@nestjs/common';
import { IProductDetail } from 'src/backstage/form/BackendProductDetailForm';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { FrontException } from '../exception/FrontException';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { reportErr } from 'src/utils/ReportError';
import {
  IProductDetailResponse,
  IFavoriteProductType,
} from '../interface/IProduct';
import { Product } from 'src/global/dataobject/Product.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly frontUserRepository: FrontUserRepository,
  ) {}

  /**
   * 获取产品详情
   * @param productId
   */
  async getProductDetail(
    productId: string,
    openid: string,
  ): Promise<IProductDetailResponse> {
    try {
      const product = await this.productRepository.findOne(productId, {
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            productBanner: 'product.productBanner',
            productVideo: 'product.productVideo',
            productConfigList: 'product.productConfigList',
          },
        },
      });

      if (!product) await reportErr('获取不到当前产品');

      const productDetail = await this.productDetailRepository.findOne(
        product.productDetailId,
      );

      if (!productDetail) await reportErr('获取不到当前商品的详情信息');

      const {favoriteType} = await this._checkFavoriteProduct(openid, productId);

      const {
        id,
        productVideo,
        productBanner,
        productName,
        productStatus,
        productType,
        productConfigList,
      } = product;
      const {
        productContent,
        productAmount,
        productBrief,
        productDeliveryCity,
        productParameter,
        productShipping,
      } = productDetail;
      return {
        productId: id,
        productVideo: {
          id: productVideo[0].id,
          url: productVideo[0].path,
        },
        productBanner: productBanner.map(({ id, path }) => ({
          id: id,
          url: path,
        })),
        productAmount,
        productName,
        productStatus,
        productType,
        productBrief,
        productContent,
        productParameter,
        productConfigList,
        productDeliveryCity,
        productSales: 100, // TODO 销量需要根据订单表进行计算
        productShipping,
        productFavorites: favoriteType
      };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 收藏商品状态
   * @param data
   * @param openid
   */
  async favoriteProduct(
    { productId, favoriteType }: IFavoriteProductType,
    openid: string,
  ): Promise<{ favoriteType: boolean }> {
    try {
      let product: Product;
      // 查询商品
      try {
        product = await this.productRepository.findOne(productId);
      } catch (e) {
        await reportErr('查询不到商品失败', e);
      }
      if (!product) await reportErr('要收藏的商品不存在');

      // 是否已经收藏
      const {
        favoriteType: storedInFavorite,
        user,
      } = await this._checkFavoriteProduct(openid, productId);
      // 判断收藏状态
      if (favoriteType) {
        // 收藏
        // 判断当前产品是否已经被收藏过
        if (storedInFavorite) await reportErr('当前商品已收藏');
        user.favoriteProductList = user.favoriteProductList.concat([product]);
      } else {
        if (!storedInFavorite) await reportErr('当前商品未收藏');
        // 取消收藏
        user.favoriteProductList = user.favoriteProductList.reduce(
          (prev, current) => {
            if (current.id !== productId) {
              prev.push(current);
            }
            return prev;
          },
          [],
        );
      }

      try {
        await this.frontUserRepository.save(user);
        return { favoriteType };
      } catch (e) {
        await reportErr('修改商品收藏状态失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  /**
   * 判断当前用户是否收藏了当前产品
   * @param openid
   * @param productId
   */
  async _checkFavoriteProduct(
    openid: string,
    productId: string,
  ): Promise<{ favoriteType: boolean; user: FrontUser }> {
    let user: FrontUser;
    try {
      try {
        user = await this.frontUserRepository.findOne({
          where: {
            openid,
          },
          relations: ['favoriteProductList'],
        });
      } catch (e) {
        await reportErr('查询当前用户失败', e);
      }
      if (!user) await reportErr('当前用户不存在');
      return {
        favoriteType: !!user.favoriteProductList.find(
          product => product.id === productId,
        ),
        user,
      };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
