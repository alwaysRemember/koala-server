/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:21:36
 * @LastEditTime: 2020-07-17 16:22:08
 * @FilePath: /koala-server/src/backstage/service/impl/BackendProductServiceImpl.ts
 */
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream, accessSync, unlinkSync, statSync } from 'fs';
import { BackendProductService } from '../BackendProductService';
import { IUploadProductBanner } from '../../interface/product';
import { ProductBannerRepository } from '../../../global/repository/ProductBannerRepository';
import { HOST } from '../../../config/FileConfig';
import { IMAGE } from '../../../global/enums/EFilePath';
import { ProductBanner } from '../../../global/dataobject/ProductBanner.entity';
import { BackendException } from '../../../backstage/exception/backendException';

@Injectable()
export class BackendProductServiceImpl implements BackendProductService {
  constructor(
    private readonly productBannerRepository: ProductBannerRepository,
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

      console.log(statSync(filePath));

      const productBanner = new ProductBanner();
      productBanner.fileName = fileName;
      productBanner.path = `${HOST}/image/${fileName}`;
      productBanner.relativePath = filePath;
      productBanner.size = statSync(filePath).size;

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
}
