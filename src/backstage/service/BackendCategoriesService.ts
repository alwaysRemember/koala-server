/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:55
 * @LastEditTime: 2020-08-13 14:19:35
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
import UploadFile from 'src/utils/UploadFile';
import { reportErr } from 'src/utils/ReportError';

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
    const uploadFile = new UploadFile(fileName, 'IMAGE');
    let filePath: string;
    try {
      // 写入文件
      filePath = uploadFile.save(file);

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
      uploadFile.delate();
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
        .addOrderBy('updateTime', 'DESC')
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
      // 判断是否已经满了7个显示在主页的分类
      if (params.isShowOnHome) {
        let length: number;
        try {
          const [, l] = await this.categoriesRepository.findAndCount({
            isShowOnHome: true,
          });
          length = l;
        } catch (e) {
          await reportErr('查询当前已经显示在首页的分类出错', e);
        }
        if (length >= 7) {
          await reportErr('显示在首页的分类过多');
        }
      }

      const data = await this.categoriesRepository.findOne(params.id);
      if (!data) {
        await reportErr('查询不到此标签信息');
      }
      data.categoriesName = params.categoriesName;
      data.isUse = params.isUse;
      data.isShowOnHome = params.isShowOnHome;

      await this.categoriesRepository.save(data);
    } catch (e) {
      throw new BackendException(e.message, e);
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
