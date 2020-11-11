/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:29:47
 * @LastEditTime: 2020-11-11 14:33:51
 * @FilePath: /koala-server/src/frontend/modules/FrontFavoritesModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontFavoritesController } from '../controller/FrontFavoritesController';
import { FavoritesService } from '../service/FavoritesService';
import { FrontUserService } from '../service/UserService';
import { FrontUserModule } from './FrontUserModule';

@Module({
  imports: [
    FrontUserModule,
  ],
  providers: [FavoritesService],
  controllers: [FrontFavoritesController],
})
export class FrontFavoritesModule {}
