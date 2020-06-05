/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-05 11:32:23
 * @LastEditTime: 2020-06-05 11:33:28
 * @FilePath: /koala-background-server/src/modules/ControllerModule.ts
 */
import { Module } from '@nestjs/common';
import { BackendUserModule } from './BackendUserModule';

const list = [BackendUserModule];

@Module({
  imports: list,
  exports: list,
})
export class ControllerModule {}
