/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:06:26
 * @LastEditTime: 2020-07-16 18:30:50
 * @FilePath: /koala-server/src/backstage/service/impl/BackendMediaLibraryServiceImpl.ts
 */
import { BackendMediaLibraryService } from '../BackendMediaLibraryService';
import { join } from 'path';
import { AUDIO, VIDEO, IMAGE, HOME } from 'src/global/enums/EFilePath';
import { BackendException } from 'src/backstage/exception/backendException';
import { createWriteStream, accessSync, unlinkSync } from 'fs';
import { BackendMediaLibrary } from 'src/backstage/dataobject/BackendMediaLibrary.entity';
import { EMediaType } from 'src/backstage/enums/EMediaLibrary';
import { BackendMediaLibraryRepository } from 'src/backstage/repository/BackendMediaLibraryRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { HOST } from 'src/config/FileConfig';

export class BackendMediaLibraryServiceImpl
  implements BackendMediaLibraryService {
  constructor(
    @InjectRepository(BackendMediaLibrary)
    private readonly backendMediaLibraryRepository: BackendMediaLibraryRepository,
  ) {}
  async saveFile(file: File): Promise<{ path: string; id: number }> {
    // 获取文件类型
    const fileType = this.getFileType(file.mimetype);

    // 保存的文件名
    const fileName = `${new Date().getTime()}_${file.originalname}`;

    // 根据文件类型放入不同文件夹
    const filePath = join(
      fileType === EMediaType.AUDIO
        ? AUDIO
        : fileType === EMediaType.VIDEO
        ? VIDEO
        : fileType === EMediaType.IMAGE
        ? IMAGE
        : HOME,
      fileName,
    );

    try {
      // 写入文件
      const writeFile = createWriteStream(filePath);
      writeFile.write(file.buffer);

      // 生成访问链接
      const path = `${HOST}/${fileType.toLowerCase()}/${fileName}`;
      // 存储数据库
      const media = new BackendMediaLibrary();
      media.type = fileType;
      media.fileName = fileName;
      media.path = path;
      media.relativePath = filePath;
      const data = await this.backendMediaLibraryRepository.insert(media);

      return { path, id: data.raw.insertId };
    } catch (e) {
      try {
        // 如果有错误判断文件是否写入，写入则删除
        await accessSync(filePath);
        await unlinkSync(filePath);
      } catch (e) {
        console.log(e.message);
      }
      throw new BackendException('上传文件出错', e.message);
    }
  }

  /**
   * 获取文件类型
   * @param type
   */
  getFileType(type: string): EMediaType {
    if (type.indexOf('image') > -1) {
      return EMediaType.IMAGE;
    } else if (type.indexOf('video') > -1) {
      return EMediaType.VIDEO;
    } else if (type.indexOf('audio') > -1) {
      return EMediaType.AUDIO;
    } else {
      throw new BackendException('暂不支持的类型');
    }
  }
}
