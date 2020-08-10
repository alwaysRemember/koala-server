import { join } from 'path';
import { AUDIO, IMAGE, VIDEO } from 'src/global/enums/EFilePath';
import { createWriteStream, accessSync, unlinkSync } from 'fs';

type fT = 'IMAGE' | 'VIDEO' | 'AUDIO';

/**
 * 写入文件
 */
export default class UploadFile {
  private fileName: string;
  private fileType: fT;
  private filePath: string; // 文件存储路径
  constructor(fileName: string, fileType: fT) {
    if (!fileName || !fileType) {
      console.log(`fileName=${fileName}, fileType=${fileType}`);
      throw new Error('请传递正确的参数');
    }
    this.filePath = join(this._getfileDefaultPath(fileType), fileName);
  }

  public save(file: File): string {
    if (!file) {
      throw new Error('请传递写入的文件');
    }
    try {
      const write = createWriteStream(this.filePath);
      write.write(file.buffer);
      return this.filePath;
    } catch (e) {
      throw new Error('写入文件失败');
    }
  }
  public delate() {
    try {
      accessSync(this.filePath);
      unlinkSync(this.filePath);
    } catch (e) {
      console.log(`删除文件失败, filePath = ${this.filePath}`);
    }
  }

  /**
   * 根据类型获取默认路径
   * @param fileType
   */
  private _getfileDefaultPath = (fileType: fT): string => {
    switch (fileType) {
      case 'AUDIO':
        return AUDIO;
      case 'IMAGE':
        return IMAGE;
      case 'VIDEO':
        return VIDEO;
      default:
        return '';
    }
  };
}
