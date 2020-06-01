/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:05:51
 * @LastEditTime: 2020-06-01 18:02:56
 * @FilePath: /koala_background_server/src/modules/UserModule.ts
 */
import { Module } from '@nestjs/common';
import { UserController } from 'src/controller/UserController';

@Module({
  controllers: [UserController],
})
export class UserModule {}
