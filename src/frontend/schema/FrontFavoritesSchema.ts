/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-11-11 14:40:49
 * @LastEditTime: 2020-11-12 15:20:21
 * @FilePath: /koala-server/src/frontend/schema/FrontFavoritesSchema.ts
 */
import * as Joi from '@hapi/joi';

export const RemoveFavorites = Joi.object({
  favoritesId: Joi.number().required(),
});
