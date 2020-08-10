/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:49:41
 * @LastEditTime: 2020-08-07 16:10:29
 * @FilePath: /koala-server/src/backstage/modules/BackendAppletHomeModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppletHomeBanner } from 'src/global/dataobject/AppletHomeBanner.entity';
import { AppletHomeBannerRepository } from 'src/global/repository/AppletHomeBannerRepository';
import { AppletHomeBannerImg } from 'src/global/dataobject/AppletHomeBannerImg.entity';
import { AppletHomeBannerImgReposioty } from 'src/global/repository/AppletHomeBannerImgReposioty';
import { BackendAppletHomeController } from '../controller/BackendAppletHomeController';
import { BackendAppletHomeBannerService } from '../service/BackendAppletHomeBannerService';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppletHomeBanner, AppletHomeBannerRepository]),
    TypeOrmModule.forFeature([
      AppletHomeBannerImg,
      AppletHomeBannerImgReposioty,
    ]),
  ],
  controllers: [BackendAppletHomeController],
  providers: [BackendAppletHomeBannerService],
})
export class BackendAppletHomeModule {}
