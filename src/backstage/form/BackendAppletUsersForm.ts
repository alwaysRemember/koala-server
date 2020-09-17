/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-09 17:53:18
 * @LastEditTime: 2020-09-17 15:33:41
 * @FilePath: /koala-server/src/backstage/form/BackendAppletUsersForm.ts
 */

export interface IBackendAppletUsersListRequestParams {
  page: number;
  pageSize: number;
}

export interface IAppletHomeAddBannerRequest {
  productId: string;
  bannerImgId: number;
}
