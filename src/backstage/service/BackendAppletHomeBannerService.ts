/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:48:16
 * @LastEditTime: 2020-08-10 17:02:49
 * @FilePath: /koala-server/src/backstage/service/BackendAppletHomeBannerService.ts
 */

import { accessSync, unlinkSync } from 'fs';
import { Injectable } from '@nestjs/common';
import UploadFile from 'src/utils/UploadFile';
import { reportErr } from 'src/utils/ReportError';
import { AppletHomeBannerImgReposioty } from 'src/global/repository/AppletHomeBannerImgReposioty';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { AppletHomeBanner } from 'src/global/dataobject/AppletHomeBanner.entity';
import { AppletHomeBannerImg } from 'src/global/dataobject/AppletHomeBannerImg.entity';
import { HOST } from 'src/config/FileConfig';
import { BackendException } from '../exception/backendException';
import { from } from 'rxjs';

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
        const { identifiers } = await this.appletHomeBannerImgRepository.insert(
          bannerImg,
        );

        return {
          id: identifiers[0].id,
          name: file.originalname,
          url: bannerImg.path,
        };
      } catch (e) {
        await reportErr('上传banner图片失败', e);
      }
    } catch (e) {
      uploadFile.delate();
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 根据id删除banner图片
   * @param id
   */
  async removeBannerImg(id: string) {
    try {
      let bannerImg: AppletHomeBannerImg;
      try {
        bannerImg = await this.appletHomeBannerImgRepository.findOne(id);
      } catch (e) {
        await reportErr('查询当前删除的图片失败', e);
      }
      if (!bannerImg) await reportErr('获取不到当前要删除的图片');

      try {
        await this.appletHomeBannerImgRepository.remove(bannerImg);
        accessSync(bannerImg.relativePath);
        unlinkSync(bannerImg.relativePath);
      } catch (e) {
        await reportErr('删除当前图片失败', e);
      }
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }
}
