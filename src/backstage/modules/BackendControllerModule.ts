/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 11:32:23
 * @LastEditTime: 2020-07-01 18:24:18
 * @FilePath: /koala-background-server/src/backstage/modules/ControllerModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserModule } from './BackendUserModule';

const list = [BackendUserModule];

@Module({
  imports: list,
  exports: list,
})
export class BackendControllerModule {}
