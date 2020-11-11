/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:54:27
 * @LastEditTime: 2020-11-11 14:55:20
 * @FilePath: /koala-server/src/global/repository/UserFavoritesRepository.ts
 */
import { EntityRepository, Repository } from "typeorm";
import { UserFavorites } from "../dataobject/UserFavorites.entity";


@EntityRepository(UserFavorites)
export class  UserFavoritseRepository extends Repository<UserFavorites>{}