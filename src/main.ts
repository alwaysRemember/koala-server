/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 16:37:18
 * @LastEditTime: 2020-06-16 18:25:39
 * @FilePath: /koala-background-server/src/main.ts
 */

import { NestFactory } from '@nestjs/core';
import Application from './Application';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter';
import { BackendExceptionFilter } from './filters/BackendExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(Application);
  app.useGlobalFilters(new HttpExceptionFilter(), new BackendExceptionFilter());

  await app.listen(3000);
}
bootstrap();
