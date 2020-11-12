/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:29:24
 * @LastEditTime: 2020-11-12 15:28:04
 * @FilePath: /koala-server/src/frontend/service/FavoritesService.ts
 */

import { Injectable } from '@nestjs/common';
import { Product } from 'src/global/dataobject/Product.entity';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { UserFavoritseRepository } from 'src/global/repository/UserFavoritesRepository';
import { reportErr } from 'src/utils/ReportError';
import { getManager } from 'typeorm';
import { FrontException } from '../exception/FrontException';
import { IGetFavoritesResponseData } from '../interface/IFrontFavorites';
import { FrontUserService } from './UserService';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly userService: FrontUserService,
    private readonly userFavoritesRepository: UserFavoritseRepository,
    private readonly produtDetailRepository: ProductDetailRepository,
    private readonly productMainImgRepository: ProductMainImgRepository,
  ) {}

  async getFavoritesData(openid: string): Promise<IGetFavoritesResponseData> {
    try {
      const { userId } = await this.userService.findByOpenid(openid);
      // 获取分页信息
      try {
        const db = this.userFavoritesRepository.createQueryBuilder('uf');
        db.where('uf.userUserId =:userId', { userId });
        db.leftJoinAndMapOne(
          'uf.product',
          'uf.product',
          'product.id = uf.productId',
        );

        const data = await db.addOrderBy('uf.createTime', 'DESC').getMany();
        const productDetailList = await this.produtDetailRepository.findByIds(
          data.map(item => item.product.productDetailId),
        );
        const productImgList = await this.productMainImgRepository.findByIds(
          data.map(item => item.product.productMainImgId),
        );
        return {
          list: data.map(
            ({
              product: {
                id,
                productName,
                productMainImgId,
                productDetailId,
                productStatus,
              },
              id: favoritesId,
            }) => ({
              favoritesId,
              productId: id,
              img: productImgList.find(v => v.id === productMainImgId).path,
              name: productName,
              amount: productDetailList.find(v => v.id === productDetailId)
                .productAmount,
              productStatus,
            }),
          ),
        };
      } catch (e) {
        await reportErr('获取收藏信息失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }

  async removeFavorites(favoritesId: number) {
    try {
      try {
        const favorites = await this.userFavoritesRepository.findOne(
          favoritesId,
        );
        if (!favorites) await reportErr('不存在当前的收藏记录');
        await this.userFavoritesRepository.remove(favorites);
      } catch (e) {
        await reportErr('删除收藏记录失败', e);
      }
    } catch (e) {
      throw new FrontException(e.message, e);
    }
  }
}
