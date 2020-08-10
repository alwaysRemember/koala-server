/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:06:26
 * @LastEditTime: 2020-08-10 15:32:19
 * @FilePath: /koala-server/src/backstage/service/BackendMediaLibraryService.ts
 */
import { join } from 'path';
import { AUDIO, VIDEO, IMAGE, HOME } from 'src/global/enums/EFilePath';
import { BackendException } from 'src/backstage/exception/backendException';
import { createWriteStream, accessSync, unlinkSync } from 'fs';
import { ProductMediaLibrary } from 'src/global/dataobject/ProductMediaLibrary.entity';
import { EMediaType } from 'src/backstage/enums/EMediaLibrary';
import { ProductMediaLibraryRepository } from 'src/global/repository/ProductMediaLibraryRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { HOST } from 'src/config/FileConfig';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import UploadFile from 'src/utils/UploadFile';

@Injectable()
export class BackendMediaLibraryService {
  constructor(
    @InjectRepository(ProductMediaLibrary)
    private readonly backendMediaLibraryRepository: ProductMediaLibraryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  /**
   * 上传文件到媒体库
   * @param file
   */
  async saveFile(file: File): Promise<{ path: string; id: number }> {
    // 获取文件类型
    const fileType = this.getFileType(file.mimetype);

    // 保存的文件名
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    let filePath: string;
    const uploadFile = new UploadFile(fileName, fileType);

    try {
      // 写入文件
      filePath = uploadFile.save(file);

      // 生成访问链接
      const path = `${HOST}/${fileType.toLowerCase()}/${fileName}`;
      // 存储数据库
      const media = new ProductMediaLibrary();
      media.type = fileType;
      media.fileName = fileName;
      media.path = path;
      media.relativePath = filePath;
      const { identifiers } = await this.backendMediaLibraryRepository.insert(
        media,
      );

      return { path, id: identifiers[0].id };
    } catch (e) {
      uploadFile.delate();
      throw new BackendException('上传文件出错', e.message);
    }
  }

  async getAllFile(): Promise<Array<ProductMediaLibrary>> {
    try {
      return await this.backendMediaLibraryRepository.find({
        select: ['id', 'type', 'path'],
      });
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  async getFileByProductId(
    productId: number,
  ): Promise<Array<ProductMediaLibrary>> {
    try {
      // 获取产品
      const product = await this.productRepository.findOne(productId);
      if (!product) {
        throw new BackendException('查询不到此商品信息');
      }
      return await this.backendMediaLibraryRepository.find({
        where: {
          product,
        },
      });
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  /**
   * 获取文件类型
   * @param type
   */
  getFileType(type: string): EMediaType {
    if (type.indexOf('image') > -1) {
      return EMediaType.IMAGE;
    } else if (type.indexOf('video') > -1) {
      return EMediaType.VIDEO;
    } else if (type.indexOf('audio') > -1) {
      return EMediaType.AUDIO;
    } else {
      throw new BackendException('暂不支持的类型');
    }
  }
}
