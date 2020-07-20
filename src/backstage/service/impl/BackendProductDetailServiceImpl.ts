/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:21:36
 * @LastEditTime: 2020-07-20 14:57:46
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

@Injectable()
export class BackendProductDetailServiceImpl
  implements BackendProductDetailService {
  constructor(
    private readonly productBannerRepository: ProductBannerRepository,
    private readonly productVideoRepository: ProductVideoRepository,
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
}
