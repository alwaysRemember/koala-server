/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:55
 * @LastEditTime: 2020-07-28 12:04:16
 * @FilePath: /koala-server/src/backstage/service/BackendCategoriesService.ts
 */
import { Injectable } from '@nestjs/common';
import {
  IAddCategories,
  ICategoriesList,
  IUpdateCategories,
} from 'src/backstage/form/BackendCategoriesForm';
import { createWriteStream, accessSync, unlinkSync } from 'fs';
import { join } from 'path';
import { BackendException } from 'src/backstage/exception/backendException';
import { IMAGE } from 'src/global/enums/EFilePath';
import { CategoriesRepository } from 'src/global/repository/CategoriesRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/global/dataobject/Categories.entity';
import { HOST } from 'src/config/FileConfig';
import { InsertResult, FindManyOptions } from 'typeorm';

@Injectable()
export class BackendCategoriesService {
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
      categories.categoriesIconUrl = `${HOST}/image/${fileName}`;
      categories.categoriesName = data.name;
      categories.relativePath = filePath;
      categories.fileName = fileName;
      categories.isUse = data.isUse === 'on' ? true : false;

      return await this.categoriesRepository.insert(categories);
    } catch (e) {
      // 如果写入出错的情况下判断文件是否存在，存在则删除文件
      try {
        await accessSync(filePath);
        await unlinkSync(filePath);
      } catch (e) {}
      throw new BackendException('新增商品分类出错');
    }
  }

  /**
   * 获取分页分类标签列表
   * @param data
   * @param isUse 是否选择已使用的数据
   */
  async getCagegoriesList(
    { page, pageSize }: ICategoriesList,
    isUse: boolean = false,
  ): Promise<{ list: Array<Categories>; total: number }> {
    const defaultParams: FindManyOptions<Categories> = {
      select: [
        'id',
        'categoriesName',
        'categoriesIconUrl',
        'isShowOnHome',
        'isUse',
        'createTime',
        'updateTime',
      ],
    };

    try {
      const db = await this.categoriesRepository.createQueryBuilder(
        'categories',
      );

      if (isUse) {
        db.andWhere('product.isUse =:isUse', { isUse });
      }
      const list = await db
        .addSelect(defaultParams.select)
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .addOrderBy('updateTime', 'ASC')
        .getMany();
      const total = await db.getCount();
      return { list, total };
    } catch (e) {
      throw new BackendException('获取商品分类标签列表出错');
    }
  }

  /**
   * 获取所有分类标签
   */
  async getAllCagetories(isUse: boolean = false) {
    try {
      if (isUse) {
        return await this.categoriesRepository.find({
          where: [{ isUse: true }],
        });
      } else {
        return await this.categoriesRepository.find();
      }
    } catch (e) {
      throw new BackendException('获取商品分类标签列表出错');
    }
  }

  /**
   * 修改商品分类标签
   * @param data
   */
  async updateCategories(params: IUpdateCategories) {
    try {
      const data = await this.categoriesRepository.findOne(params.id);
      if (!data) {
        throw new BackendException('查询不到此标签信息');
      }
      await this.categoriesRepository.update(params.id, params);
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  async findById(id: string) {
    try {
      return await this.categoriesRepository.findOne(id);
    } catch (e) {
      throw new BackendException(e.message);
    }
  }
}
