/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-01 18:12:55
 * @LastEditTime: 2020-07-07 19:05:05
 * @FilePath: /koala-server/src/backstage/service/impl/BackendCategoriesServiceImpl.ts
 */
import { Injectable } from '@nestjs/common';
import { BackendCategoriesService } from '../BackendCategoriesService';
import { IAddCategories } from 'src/backstage/form/BackendCategoriesForm';
import { createWriteStream, existsSync } from 'fs';
import { join } from 'path';
import { BackendException } from 'src/backstage/exception/backendException';
import { IMAGE } from 'src/global/enums/EFilePath';
import { exception } from 'console';

@Injectable()
export class BackendCategoriesServiceImpl implements BackendCategoriesService {
  save(file: File, data: IAddCategories): void {
    // TODO 需配置开发环境的docker中nginx指向
    try {
      const writeImage = createWriteStream(
        join(
          IMAGE,
          `${new Date().getTime()}_${data.name}_${file.originalname}`,
        ),
      );
      writeImage.write(file.buffer);
    } catch (e) {
      throw new BackendException(e);
    }
  }
}
