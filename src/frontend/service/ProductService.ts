/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-20 15:58:44
 * @LastEditTime: 2020-08-25 15:04:42
 * @FilePath: /koala-server/src/frontend/service/ProductService.ts
 */

import { Injectable } from '@nestjs/common';
import { IProductDetail } from 'src/backstage/form/BackendProductDetailForm';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { FrontException } from '../exception/FrontException';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { reportErr } from 'src/utils/ReportError';
import { IProductDetailResponse } from '../interface/IProduct';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productDetailRepository: ProductDetailRepository,
  ) {}

  /**
   * 获取产品详情
   * @param productId
   */
  async getProductDetail(productId: string): Promise<IProductDetailResponse> {
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
      };
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
