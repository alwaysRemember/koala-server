/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:21:36
 * @LastEditTime: 2020-07-20 19:20:33
 * @FilePath: /koala-server/src/backstage/service/impl/BackendProductDetailServiceImpl.ts
 */
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream, accessSync, unlinkSync, statSync } from 'fs';
import { BackendProductDetailService } from '../BackendProductDetailService';
import {
  IUploadProductBanner,
  IUploadProductVideo,
} from '../../interface/productDetail';
import { ProductBannerRepository } from '../../../global/repository/ProductBannerRepository';
import { HOST } from '../../../config/FileConfig';
import { IMAGE, VIDEO } from '../../../global/enums/EFilePath';
import { ProductBanner } from '../../../global/dataobject/ProductBanner.entity';
import { BackendException } from '../../exception/backendException';
import { ProductVideo } from 'src/global/dataobject/ProductVideo.entity';
import { ProductVideoRepository } from 'src/global/repository/ProductVideoRepository';
import { IProductDetail } from 'src/backstage/form/BackendProductDetailForm';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { RedisCacheServiceImpl } from './RedisCacheServiceImpl';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { BackendUserServiceImpl } from './BackendUserServiceImpl';
import { BackendCategoriesServiceImpl } from './BackendCategoriesServiceImpl';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { EProductStatus } from 'src/global/enums/EProduct';
import { EBackendUserType } from 'src/backstage/enums/EBackendUserType';
import { getManager, EntityManager } from 'typeorm';

@Injectable()
export class BackendProductDetailServiceImpl
  implements BackendProductDetailService {
  constructor(
    private readonly productBannerRepository: ProductBannerRepository,
    private readonly productVideoRepository: ProductVideoRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly redisService: RedisCacheServiceImpl,
    private readonly backendUserService: BackendUserServiceImpl,
    private readonly backendCategoriesService: BackendCategoriesServiceImpl,
  ) {}

  /**
   * 上传banner
   * @param file
   */
  async uploadProductBanner(file: File): Promise<IUploadProductBanner> {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const filePath = join(IMAGE, fileName);

    try {
      const imgWrite = createWriteStream(filePath);
      imgWrite.write(file.buffer);

      const productBanner = new ProductBanner();
      productBanner.fileName = fileName;
      productBanner.path = `${HOST}/image/${fileName}`;
      productBanner.relativePath = filePath;
      productBanner.size = file.size;

      const {
        raw: { insertId },
      } = await this.productBannerRepository.insert(productBanner);

      return {
        id: insertId,
        url: productBanner.path,
        name: file.originalname,
        size: productBanner.size,
      };
    } catch (e) {
      try {
        await accessSync(filePath);
        await unlinkSync(filePath);
      } catch (e) {}
      throw new BackendException('上传banner失败', e.message);
    }
  }

  /**
   * 上传视频文件
   * @param file
   */
  async uploadProductVideo(file: File): Promise<IUploadProductVideo> {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const filePath = join(VIDEO, fileName);
    try {
      const write = createWriteStream(filePath);
      write.write(file.buffer);
      const video = new ProductVideo();
      video.path = `${HOST}/video/${fileName}`;
      video.relativePath = filePath;
      video.fileName = fileName;

      const {
        raw: { insertId },
      } = await this.productVideoRepository.insert(video);
      return {
        id: insertId,
        name: file.originalname,
        url: video.path,
        size: file.size,
      };
    } catch (e) {
      try {
        await accessSync(filePath);
        await unlinkSync(filePath);
      } catch (e) {}
      throw new BackendException('上传视频失败', e.message);
    }
  }

  /**
   * 上传产品
   * @param data
   * @param token 用户标识
   */
  async uploadProduct(data: IProductDetail, token: string) {
    try {
      // 从redis中获取用户信息
      const { userId }: BackendUser = JSON.parse(
        JSON.stringify(await this.redisService.get(token)),
      );

      // 查询是否拥有此用户
      const user = await this.backendUserService.backendFindByUserId(userId);
      if (!user) throw new BackendException('查无此用户');
      const product = new Product();
      const productDetail = new ProductDetail();
      // 查询商品分类标签是否正确
      const categories = await this.backendCategoriesService.findById(
        data.categoriesId,
      );
      // 判断标签是否存在&&是否使用
      if (categories && !categories.isUse) {
        throw new BackendException('商品分类标签异常,暂不能使用');
      }
      // 产品详细信息
      productDetail.productAmount = data.amount;
      productDetail.productBrief = data.productBrief;
      productDetail.productContent = data.productDetail;

      // 产品主要信息
      product.backendUser = user;
      product.categories = categories;
      product.productDetail = productDetail;

      // 判断当前用户权限
      // 如果不是管理员，并且产品状态为上线，则需要改为待审核，等待管理员手动上线
      if (user.userType !== EBackendUserType.ADMIN) {
        product.productStatus =
          data.productStatus === EProductStatus.PUT_ON_SHELF
            ? EProductStatus.UNDER_REVIEW
            : data.productStatus;
      } else {
        product.productStatus = data.productStatus;
      }

      await getManager().transaction(async (entityManage: EntityManager) => {
        await entityManage.save(ProductDetail, productDetail);
        throw new BackendException('131232');
      });
    } catch (e) {
      throw new BackendException('新增商品出错', e.message);
    }
  }
}
