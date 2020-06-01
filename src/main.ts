/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 16:37:18
 * @LastEditTime: 2020-05-28 18:43:59
 * @FilePath: /koala_background_server/src/main.ts
 */

import { NestFactory } from '@nestjs/core';
import Application from './Application';
import { HttpExceptionFilter } from './filters/HttpExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(Application);
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
