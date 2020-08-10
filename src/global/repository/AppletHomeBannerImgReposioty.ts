/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:46:48
 * @LastEditTime: 2020-08-07 15:47:17
 * @FilePath: /koala-server/src/global/repository/AppletHomeBannerImgReposioty.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { AppletHomeBannerImg } from '../dataobject/AppletHomeBannerImg.entity';

@EntityRepository(AppletHomeBannerImg)
export class AppletHomeBannerImgReposioty extends Repository<
  AppletHomeBannerImg
> {}
