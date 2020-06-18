/*
 * 数据库配置
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:20:39
 * @LastEditTime: 2020-06-18 17:56:15
 * @FilePath: /koala-background-server/src/config/MysqlConfig.ts
 */
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { join } from 'path';

const defaultConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'tanghaojie',
  database: 'koala',
  entities: [join(__dirname, '../dataobject/*.entity{.ts,.js}')],
  synchronize: true,
  debug: false,
};

export default defaultConfig;
