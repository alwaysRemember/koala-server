/*
 * 数据库配置
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:20:39
 * @LastEditTime: 2020-12-02 19:02:30
 * @FilePath: /koala-server/src/config/MysqlConfig.ts
 */
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { join } from 'path';

const defaultConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    join(__dirname, '../backstage/dataobject/*.entity{.ts,.js}'),
    join(__dirname, '../frontend/dataobject/*.entity{.ts,.js}'),
    join(__dirname, '../global/dataobject/*.entity{.ts,.js}'),
  ],
  synchronize: true,
  debug: false,
};

export default defaultConfig;
