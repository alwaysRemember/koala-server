/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:48:16
 * @LastEditTime: 2020-08-11 14:09:54
 * @FilePath: /koala-server/src/backstage/service/BackendAppletHomeBannerService.ts
 */

import { accessSync, unlinkSync } from 'fs';
import { Injectable } from '@nestjs/common';
import UploadFile from 'src/utils/UploadFile';
import { reportErr } from 'src/utils/ReportError';
import { AppletHomeBannerImgReposioty } from 'src/global/repository/AppletHomeBannerImgReposioty';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { AppletHomeBannerImg } from 'src/global/dataobject/AppletHomeBannerImg.entity';
import { HOST } from 'src/config/FileConfig';
import { BackendException } from '../exception/backendException';
import { IAppletHomeAddBannerRequest } from '../interface/IAppletHome';
import { Product } from 'src/global/dataobject/Product.entity';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { EProductStatus } from 'src/global/enums/EProduct';
import { AppletHomeBanner } from 'src/global/dataobject/AppletHomeBanner.entity';

@Injectable()
export class BackendAppletHomeBannerService {
  constructor(
    private readonly appletHomeBannerImgRepository: AppletHomeBannerImgReposioty,
    private readonly appletHomeBannerRepository: AppletHomeBannerRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 上传banner图片
   * @param file
   */
  async uploadBannerImg(file: File) {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const uploadFile = new UploadFile(fileName, 'IMAGE');
    let filePath: string;
    try {
      try {
        filePath = uploadFile.save(file);
      } catch (e) {
        await reportErr(e.message, e);
      }
      const bannerImg = new AppletHomeBannerImg();
      bannerImg.fileName = fileName;
      bannerImg.path = `${HOST}/image/${fileName}`;
      bannerImg.relativePath = filePath;
      try {
        const { identifiers } = await this.appletHomeBannerImgRepository.insert(
          bannerImg,
        );

        return {
          id: identifiers[0].id,
          name: file.originalname,
          url: bannerImg.path,
        };
      } catch (e) {
        await reportErr('上传banner图片失败', e);
      }
    } catch (e) {
      uploadFile.delate();
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 根据id删除banner图片
   * @param id
   */
  async removeBannerImg(id: string) {
    try {
      let bannerImg: AppletHomeBannerImg;
      try {
        bannerImg = await this.appletHomeBannerImgRepository.findOne(id);
      } catch (e) {
        await reportErr('查询当前删除的图片失败', e);
      }
      if (!bannerImg) await reportErr('获取不到当前要删除的图片');

      try {
        await this.appletHomeBannerImgRepository.remove(bannerImg);
        accessSync(bannerImg.relativePath);
        unlinkSync(bannerImg.relativePath);
      } catch (e) {
        await reportErr('删除当前图片失败', e);
      }
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 新增banner
   * @param params
   */
  async addBanner({ productId, bannerImgId }: IAppletHomeAddBannerRequest) {
    try {
      //  判断产品可用性
      let product: Product;
      let bannerImg: AppletHomeBannerImg;
      try {
        product = await this.productRepository.findOne(productId);
      } catch (e) {
        await reportErr('查询产品失败', e);
      }
      if (!product) await reportErr('获取产品信息失败');
      if (
        product.isDel ||
        product.productStatus !== EProductStatus.PUT_ON_SHELF
      )
        await reportErr('产品状态非正常状态，禁止使用');
      // 判断bannerImg是否存在
      try {
        bannerImg = await this.appletHomeBannerImgRepository.findOne(
          bannerImgId,
        );
      } catch (e) {
        await reportErr('获取banner图片失败', e);
      }
      if (!bannerImg) await reportErr('banner图片不存在，请重新上传');

      const banner = new AppletHomeBanner();
      banner.productId = product.id;
      banner.bannerImg = bannerImg;
      await this.appletHomeBannerRepository.save(banner);
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }
}
