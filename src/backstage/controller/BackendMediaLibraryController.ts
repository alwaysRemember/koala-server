/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:05:12
 * @LastEditTime: 2020-07-17 15:22:46
 * @FilePath: /koala-server/src/backstage/controller/BackendMediaLibraryController.ts
 */
import {
  Controller,
  Body,
  Post,
  UploadedFile,
  HttpCode,
  UseInterceptors,
  UsePipes,
  Get,
} from '@nestjs/common';
import { SetPermissionsForController } from '../utils';
import { EBackendUserType } from '../enums/EBackendUserType';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResultVoUtil } from 'src/utils/ResultVoUtil';
import { BackendMediaLibraryServiceImpl } from '../service/impl/BackendMediaLibraryServiceImpl';

@Controller('/media-library')
export class BackendMediaLibraryController {
  constructor(
    private readonly backendMediaLibraryService: BackendMediaLibraryServiceImpl,
  ) {}

  /**
   * 上传文件到媒体库
   * @param file
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.PROXY)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload-file')
  public async uploadFile(@UploadedFile() file) {
    const result = new ResultVoUtil();
    if (!file) return result.error('请选择上传的文件');
    try {
      const { path, id } = await this.backendMediaLibraryService.saveFile(file);
      return result.success({ filePath: path, id });
    } catch (e) {
      return result.error(e.message);
    }
  }

  /**
   * 获取媒体库文件列表
   */
  @HttpCode(200)
  @SetPermissionsForController(EBackendUserType.PROXY)
  @Get('/get-file-list')
  public async getfileList() {
    const result = new ResultVoUtil();
    try {
      const list = await this.backendMediaLibraryService.getAllFile();
      return result.success(list);
    } catch (e) {
      return result.error(e.message);
    }
  }
}
