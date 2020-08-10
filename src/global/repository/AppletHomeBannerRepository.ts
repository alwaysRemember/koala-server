/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-08-07 15:45:54
 * @LastEditTime: 2020-08-07 15:46:35
 * @FilePath: /koala-server/src/global/repository/AppletHomeBannerRepository.ts
 */
import { Repository, EntityRepository } from 'typeorm';
import { AppletHomeBanner } from '../dataobject/AppletHomeBanner.entity';

@EntityRepository(AppletHomeBanner)
export class AppletHomeBannerRepository extends Repository<AppletHomeBanner> {}
