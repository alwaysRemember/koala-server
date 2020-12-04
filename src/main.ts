/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 16:37:18
 * @LastEditTime: 2020-12-02 19:04:04
 * @FilePath: /koala-server/src/main.ts
 */

import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import Application from './Application';
import { HttpExceptionFilter } from './global/filters/HttpExceptionFilter';
import { BackendExceptionFilter } from './backstage/filters/BackendExceptionFilter';
import filePathArr from './global/enums/EFilePath';
import { fstat, existsSync, mkdirSync } from 'fs';
import * as bodyParserXml from 'body-parser-xml';
bodyParserXml(bodyParser);

async function bootstrap() {
  const app = await NestFactory.create(Application);
  app.useGlobalFilters(new HttpExceptionFilter(), new BackendExceptionFilter());
  app.setGlobalPrefix('api');
  app.use(bodyParser['xml']());
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
