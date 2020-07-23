/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:06:26
 * @LastEditTime: 2020-07-23 14:56:09
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

    // 根据文件类型放入不同文件夹
    const filePath = join(
      fileType === EMediaType.AUDIO
        ? AUDIO
        : fileType === EMediaType.VIDEO
        ? VIDEO
        : fileType === EMediaType.IMAGE
        ? IMAGE
        : HOME,
      fileName,
    );

    try {
      // 写入文件
      const writeFile = createWriteStream(filePath);
      writeFile.write(file.buffer);

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
      try {
        // 如果有错误判断文件是否写入，写入则删除
        await accessSync(filePath);
        await unlinkSync(filePath);
      } catch (e) {}
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
