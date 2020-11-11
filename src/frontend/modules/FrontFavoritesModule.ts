/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:29:47
 * @LastEditTime: 2020-11-11 15:39:13
 * @FilePath: /koala-server/src/frontend/modules/FrontFavoritesModule.ts
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FrontUser } from 'src/global/dataobject/User.entity';
import { FrontUserRepository } from 'src/global/repository/FrontUserRepository';
import { FrontFavoritesController } from '../controller/FrontFavoritesController';
import { FavoritesService } from '../service/FavoritesService';

@Module({
  imports: [TypeOrmModule.forFeature([FrontUser, FrontUserRepository])],
  providers: [FavoritesService],
  controllers: [FrontFavoritesController],
})
export class FrontFavoritesModule {}
