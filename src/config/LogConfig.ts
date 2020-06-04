/*
 *  日志配置
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-05-28 17:30:15
 * @LastEditTime: 2020-05-28 19:13:01
 * @FilePath: /koala_background_server/src/config/LogConfig.ts
 */

import * as path from 'path';
import * as fs from 'fs';
import * as log4js from 'log4js';

export const category: Array<string> = ['system'];

export const level: Array<string> = ['Error', 'Info'];

const checkFile = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

let loggerConfig = {
  appenders: {
    console: {
      type: 'console',
    },
  },
  replaceConsole: true, // 控制台日志输出
  categories: {
    default: {
      appenders: ['console'],
      level: 'info',
    },
  },
};

const DEFAULT_PATTERN = 'yyy-MM-dd.log';

// log主目录
const dirPath = path.join(__dirname, '../log');

// level目录
const infoPath = path.join(dirPath, '/info/');
const errorPath = path.join(dirPath, '/error/');

// 生成目录
checkFile(dirPath);
checkFile(infoPath);
checkFile(errorPath);

// 构建分级log配置

category.forEach(c => {
  // 生成配置(info || error)
  level.forEach(type => {
    const name: string = `${c}${type}`;
    loggerConfig.appenders[name] = {
      type: 'dateFile',
      pattern: DEFAULT_PATTERN,
      filename: path.join(
        type === 'Info' ? infoPath : errorPath,
        type.toLowerCase(),
      ),
      alwaysIncludePattern: true,
      category: name,
    };
    loggerConfig.categories[name] = {
      appenders: [name, 'console'],
      level: type.toLowerCase(),
    };
  });
});

log4js.configure(loggerConfig);

/**
 * 输出到info文件
 */
export const sysInfo = log4js.getLogger('systemInfo');

/**
 * 输出到error文件
 */
export const sysErr = log4js.getLogger('systemError');

export default log4js;
