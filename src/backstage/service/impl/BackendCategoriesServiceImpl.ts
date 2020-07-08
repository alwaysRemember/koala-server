/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:55
 * @LastEditTime: 2020-07-08 17:06:29
 * @FilePath: /koala-server/src/backstage/service/impl/BackendCategoriesServiceImpl.ts
 */
import { Injectable } from '@nestjs/common';
import { BackendCategoriesService } from '../BackendCategoriesService';
import { IAddCategories } from 'src/backstage/form/BackendCategoriesForm';
import { createWriteStream, accessSync, unlinkSync } from 'fs';
import { join } from 'path';
import { BackendException } from 'src/backstage/exception/backendException';
import { IMAGE } from 'src/global/enums/EFilePath';
import { CategoriesRepository } from 'src/global/repository/CategoriesRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/global/dataobject/Categories.entity';
import { HOST } from 'src/config/FileConfig';
import { InsertResult } from 'typeorm';

@Injectable()
export class BackendCategoriesServiceImpl implements BackendCategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  /**
   * 保存文件
   * @param file
   * @param data
   */
  async save(file: File, data: IAddCategories): Promise<InsertResult> {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const filePath = join(IMAGE, fileName);
    try {
      // 写入文件
      const writeImage = createWriteStream(filePath);
      writeImage.write(file.buffer);

      // 存入数据库
      const categories = new Categories();
      categories.categoriesIconUrl = `${HOST}/${fileName}`;
      categories.categoriesName = data.name;
      categories.fileName = fileName;
      categories.isUse = data.isUse === 'on' ? true : false;
      return await this.categoriesRepository.insert(categories);
    } catch (e) {
      // 如果写入出错的情况下判断文件是否存在，存在则删除文件
      try {
        await accessSync(filePath);
        await unlinkSync(filePath);
      } catch (e) {}
      throw new BackendException(e);
    }
  }
}
