/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:48:16
 * @LastEditTime: 2020-08-10 14:59:01
 * @FilePath: /koala-server/src/backstage/service/BackendAppletHomeBannerService.ts
 */

import { Injectable } from '@nestjs/common';
import UploadFile from 'src/utils/UploadFile';
import { reportErr } from 'src/utils/ReportError';
import { AppletHomeBannerImgReposioty } from 'src/global/repository/AppletHomeBannerImgReposioty';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { AppletHomeBanner } from 'src/global/dataobject/AppletHomeBanner.entity';
import { AppletHomeBannerImg } from 'src/global/dataobject/AppletHomeBannerImg.entity';
import { HOST } from 'src/config/FileConfig';
import { BackendException } from '../exception/backendException';

@Injectable()
export class BackendAppletHomeBannerService {
  constructor(
    private readonly appletHomeBannerImgRepository: AppletHomeBannerImgReposioty,
    private readonly appletHomeBannerRepository: AppletHomeBannerRepository,
  ) {}

  /**
   * 上传banner图片
   * @param file
   */
  async uploadBannerImg(file: File) {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const uploadFile = new UploadFile(fileName, 'IMAGE');
    let filePath: string;
    try {
      try {
        filePath = uploadFile.save(file);
      } catch (e) {
        await reportErr(e.message, e);
      }
      const bannerImg = new AppletHomeBannerImg();
      bannerImg.fileName = fileName;
      bannerImg.path = `${HOST}/image/${fileName}`;
      bannerImg.relativePath = filePath;
      try {
        await this.appletHomeBannerImgRepository.insert(bannerImg);
      } catch (e) {
        await reportErr('上传banner图片失败', e);
      }
    } catch (e) {
      uploadFile.delate();
      throw new BackendException(e.message, e);
    }
  }
}
