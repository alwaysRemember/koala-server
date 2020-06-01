/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-01 18:49:34
 * @LastEditTime: 2020-06-01 18:51:31
 * @FilePath: /koala-background-server/src/modules/BackendUserModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserController } from 'src/controller/BackendUserController';

@Module({
  controllers: [BackendUserController],
})
export class BackendUserModule {}
