/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 16:37:18
 * @LastEditTime: 2020-07-10 14:38:35
 * @FilePath: /koala-server/src/main.ts
 */

import { NestFactory } from '@nestjs/core';
import Application from './Application';
import { HttpExceptionFilter } from './global/filters/HttpExceptionFilter';
import { BackendExceptionFilter } from './backstage/filters/BackendExceptionFilter';
import filePathArr from './global/enums/EFilePath';
import { fstat, existsSync, mkdirSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(Application);
  app.useGlobalFilters(new HttpExceptionFilter(), new BackendExceptionFilter());
  app.setGlobalPrefix('api');
  // 创建文件夹
  filePathArr.forEach((path: string) => {
    // 判断路径是否存在
    if (!existsSync(path)) {
      mkdirSync(path);
    }
  });

  await app.listen(3000);
}
bootstrap();
