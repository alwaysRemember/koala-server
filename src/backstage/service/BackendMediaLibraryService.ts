/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-15 17:06:07
 * @LastEditTime: 2020-07-16 18:28:51
 * @FilePath: /koala-server/src/backstage/service/BackendMediaLibraryService.ts
 */

export interface BackendMediaLibraryService {
  saveFile(file: File): Promise<{ path: string; id: number }>;
}
