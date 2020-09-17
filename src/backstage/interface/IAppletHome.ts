/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-10 17:45:57
 * @LastEditTime: 2020-09-17 15:32:50
 * @FilePath: /koala-server/src/backstage/interface/IAppletHome.ts
 */

import { EAppletHomeBannerTypeEnum } from 'src/global/enums/EAppletHomeBanner';



export interface IAppletHomeAddBannerResponse {
  id: number;
  name: string;
  url: string;
}

export interface IAppletHomeGetBannerListResponseItem {
  id: number;
  productId: string;
  type: EAppletHomeBannerTypeEnum;
  imgPath: string;
}
