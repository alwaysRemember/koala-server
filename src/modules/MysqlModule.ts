/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-06-04 19:34:47
 * @LastEditTime: 2020-06-05 11:31:54
 * @FilePath: /koala-background-server/src/modules/MysqlModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import mysqlConfig from '../config/MysqlConfig';

const mysql = TypeOrmModule.forRoot(mysqlConfig);

@Module({
  imports: [mysql],
  exports: [mysql],
})
export class MysqlModule {}
