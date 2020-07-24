/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:21:36
 * @LastEditTime: 2020-07-24 21:41:22
 * @FilePath: /koala-server/src/backstage/service/BackendProductService.ts
 */
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream, accessSync, unlinkSync, statSync } from 'fs';
import {
  IUploadProductBanner,
  IUploadProductVideo,
  IProductResponse,
} from '../interface/IProductDetail';
import { ProductBannerRepository } from '../../global/repository/ProductBannerRepository';
import { HOST } from '../../config/FileConfig';
import { IMAGE, VIDEO } from '../../global/enums/EFilePath';
import { ProductBanner } from '../../global/dataobject/ProductBanner.entity';
import { BackendException } from '../exception/backendException';
import { ProductVideo } from 'src/global/dataobject/ProductVideo.entity';
import { ProductVideoRepository } from 'src/global/repository/ProductVideoRepository';
import { IProductDetail } from 'src/backstage/form/BackendProductDetailForm';
import { ProductDetail } from 'src/global/dataobject/ProductDetail.entity';
import { Product } from 'src/global/dataobject/Product.entity';
import { RedisCacheService } from './RedisCacheService';
import { BackendUser } from 'src/backstage/dataobject/BackendUser.entity';
import { BackendUserService } from './BackendUserService';
import { ProductDetailRepository } from 'src/global/repository/ProductDetailRepository';
import { EProductStatus, EDefaultSelect } from 'src/global/enums/EProduct';
import { EBackendUserType } from 'src/backstage/enums/EBackendUserType';
import {
  getManager,
  EntityManager,
  In,
  FindConditions,
  Raw,
  LessThanOrEqual,
} from 'typeorm';
import { ProductMediaLibrary } from 'src/global/dataobject/ProductMediaLibrary.entity';
import { ProductMediaLibraryRepository } from 'src/global/repository/ProductMediaLibraryRepository';
import { ProductRepository } from 'src/global/repository/ProductRepository';
import { async } from 'rxjs';
import { BackendCategoriesService } from './BackendCategoriesService';
import {
  IProductListRequest,
  IProductItemResponse,
} from '../interface/IProductList';
import { Categories } from 'src/global/dataobject/Categories.entity';

@Injectable()
export class BackendProductService {
  constructor(
    private readonly productBannerRepository: ProductBannerRepository,
    private readonly productVideoRepository: ProductVideoRepository,
    private readonly productRepository: ProductRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly redisService: RedisCacheService,
    private readonly backendUserService: BackendUserService,
    private readonly backendCategoriesService: BackendCategoriesService,
    private readonly productMediaLibraryRepository: ProductMediaLibraryRepository,
  ) {}

  /**
   * 上传banner
   * @param file
   */
  async uploadProductBanner(file: File): Promise<IUploadProductBanner> {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const filePath = join(IMAGE, fileName);

    try {
      const imgWrite = createWriteStream(filePath);
      imgWrite.write(file.buffer);

      const productBanner = new ProductBanner();
      productBanner.fileName = fileName;
      productBanner.path = `${HOST}/image/${fileName}`;
      productBanner.relativePath = filePath;
      productBanner.size = file.size;

      const { identifiers } = await this.productBannerRepository.insert(
        productBanner,
      );

      return {
        id: identifiers[0].id,
        url: productBanner.path,
        name: file.originalname,
        size: productBanner.size,
      };
    } catch (e) {
      try {
        accessSync(filePath);
        unlinkSync(filePath);
      } catch (e) {}
      throw new BackendException('上传banner失败', e.message);
    }
  }

  /**
   * 上传视频文件
   * @param file
   */
  async uploadProductVideo(file: File): Promise<IUploadProductVideo> {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const filePath = join(VIDEO, fileName);
    try {
      const write = createWriteStream(filePath);
      write.write(file.buffer);
      const video = new ProductVideo();
      video.path = `${HOST}/video/${fileName}`;
      video.relativePath = filePath;
      video.fileName = fileName;

      const { identifiers } = await this.productVideoRepository.insert(video);
      return {
        id: identifiers[0].id,
        name: file.originalname,
        url: video.path,
        size: file.size,
      };
    } catch (e) {
      try {
        accessSync(filePath);
        unlinkSync(filePath);
      } catch (e) {}
      throw new BackendException('上传视频失败', e.message);
    }
  }

  /**
   * 上传产品
   * @param data
   * @param token 用户标识
   */
  async uploadProduct(data: IProductDetail, token: string): Promise<string> {
    try {
      // 从redis中获取用户信息
      const { userId }: BackendUser = JSON.parse(
        JSON.stringify(await this.redisService.get(token)),
      );

      // 查询是否拥有此用户
      const user = await this.backendUserService.backendFindByUserId(userId);
      if (!user) throw new BackendException('查无此用户');

      const product = new Product();
      const productDetail = new ProductDetail();
      const hasProduct: boolean = !!data.productId; // 是否已经当前已有产品
      let defaultProduct: Product; // 当前的产品
      let defaultProductDetail: ProductDetail; // 当前的产品详情

      // 查询商品分类标签是否正确
      const categories = await this.backendCategoriesService.findById(
        data.categoriesId,
      );
      // 判断标签是否存在&&是否使用
      if (categories && !categories.isUse) {
        throw new BackendException('商品分类标签异常,暂不能使用');
      }

      // 产品详细信息
      productDetail.productAmount = data.amount;
      productDetail.productBrief = data.productBrief;
      productDetail.productContent = data.productDetail;

      // 判断是否更新产品
      if (hasProduct) {
        defaultProduct = await this.productRepository.findOne({
          join: {
            alias: 'product',
            leftJoinAndSelect: {
              productDetail: 'product.productDetail',
            },
          },
          where: {
            id: data.productId,
          },
        });
        if (!defaultProduct) {
          throw new BackendException('查询不到此商品');
        }

        defaultProductDetail = await this.productDetailRepository.findOne({
          where: {
            id: defaultProduct.productDetail.id,
          },
        });
        if (!defaultProductDetail) {
          throw new BackendException('查询不到此商品详情');
        }
        productDetail.id = defaultProductDetail.id;
        product.id = defaultProduct.id;
      }

      // 产品主要信息
      product.backendUser = user;
      product.categories = categories;
      product.productDetail = productDetail;
      product.productName = data.name;

      // 判断当前用户权限
      // 如果不是管理员，并且产品状态为上线，则需要改为待审核，等待管理员手动上线
      if (user.userType !== EBackendUserType.ADMIN) {
        product.productStatus =
          data.productStatus === EProductStatus.PUT_ON_SHELF
            ? EProductStatus.UNDER_REVIEW
            : data.productStatus;
      } else {
        product.productStatus = data.productStatus;
      }

      // 关联banner文件
      const banner: Array<ProductBanner | undefined> = await Promise.all(
        (data.bannerIdList || []).map(
          async (id: string) => await this.productBannerRepository.findOne(id),
        ),
      );
      // 过滤掉不存在的banner
      product.productBanner = this.filterArray<ProductBanner | undefined>(
        banner,
      );

      // 关联详情中的媒体文件
      const mediaList: Array<
        ProductMediaLibrary | undefined
      > = await Promise.all(
        (data.mediaIdList || []).map(
          async (id: string) =>
            await this.productMediaLibraryRepository.findOne(id),
        ),
      );
      product.productMediaLibrary = this.filterArray<
        ProductMediaLibrary | undefined
      >(mediaList);

      // 关联商品视频文件
      if (data.videoId) {
        const video = await this.productVideoRepository.findOne(data.videoId);
        if (video) {
          product.productVideo = [video];
        }
      }

      // 写入数据
      return await getManager()
        .transaction(async (entityManage: EntityManager) => {
          // 保存详情
          await entityManage.save(ProductDetail, productDetail);
          const result = await entityManage.save(Product, product);

          // 判断banner是否更改
          if (data.delBannerIdList?.length) {
            const delBannerList: Array<ProductBanner> = await this.productBannerRepository.find(
              {
                id: In(data.delBannerIdList),
              },
            );
            delBannerList.forEach(async (item: ProductBanner) => {
              const { relativePath } = item;
              await this.productBannerRepository.remove(item);
              accessSync(relativePath);
              unlinkSync(relativePath);
            });
          }

          // 判断video是否更改
          if (data.delVideoIdList?.length) {
            const delVideoList: Array<ProductVideo> = await this.productVideoRepository.find(
              {
                id: In(data.delVideoIdList),
              },
            );
            delVideoList.forEach(async (item: ProductVideo) => {
              const { relativePath } = item;
              await this.productVideoRepository.remove(item);
              accessSync(relativePath);
              unlinkSync(relativePath);
            });
          }

          // 判断详情中的媒体资源是否发生改变
          if (data.delMediaIdList?.length) {
            const delMediaList: Array<ProductMediaLibrary> = await this.productMediaLibraryRepository.find(
              {
                id: In(data.delMediaIdList),
              },
            );
            delMediaList.forEach(async (item: ProductMediaLibrary) => {
              const { relativePath } = item;
              await this.productMediaLibraryRepository.remove(item);
              accessSync(relativePath);
              unlinkSync(relativePath);
            });
          }
          return result.id;
        })
        .catch(e => {
          throw new BackendException('写入数据失败', e.message);
        });
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  /**
   * 根据id获取商品详情
   * @param productId
   */
  async getProductDetail(productId: number): Promise<IProductResponse> {
    try {
      const product = await this.productRepository.findOne({
        join: {
          alias: 'product',
          leftJoinAndSelect: {
            productDetail: 'product.productDetail',
            categories: 'product.categories',
            productBanner: 'product.productBanner',
            productVideo: 'product.productVideo',
          },
        },
        where: { id: productId },
      });
      if (!product) {
        throw new BackendException('查询不到此商品信息');
      }

      const {
        productName,
        productStatus,
        categories,
        productDetail: { productAmount, productContent, productBrief },
        productBanner,
        productVideo,
      } = product;

      return {
        name: productName,
        productStatus: productStatus,
        categoriesId: categories.id,
        amount: productAmount,
        productBrief: productBrief,
        productDetail: productContent,
        bannerList: (productBanner || ([] as Array<ProductBanner>)).map(
          ({ id, fileName, size, path }: ProductBanner) => ({
            id,
            name: fileName,
            size,
            url: path,
          }),
        ),
        videoData: productVideo && {
          id: productVideo[0].id,
          name: productVideo[0].fileName,
          url: productVideo[0].path,
        },
      };
    } catch (e) {
      throw new BackendException(e.message);
    }
  }

  /**
   * 获取产品列表
   * @param param0
   */
  async getProductList(
    {
      page,
      pageSize,
      categoriesId,
      productStatus,
      userId,
      minAmount,
      maxAmount,
    }: IProductListRequest,
    token: string,
  ): Promise<{ total: number; list: Array<IProductItemResponse> }> {
    // 分页参数
    const maxIndex: number = page * pageSize;
    const minIndex: number = maxIndex - pageSize;

    try {
      // 判断token是否存在
      const userStr = await this.redisService.get(token);
      if (!userStr) await Promise.reject({ message: '用户登录态不正确' });

      const { userId: tokenUserId }: BackendUser = JSON.parse(userStr);
      const db = this.productRepository.createQueryBuilder('product');

      // 用户查表
      const user = await this.backendUserService.backendFindByUserId(
        tokenUserId,
      );
      if (!user) await Promise.reject({ message: '用户不存在' });

      // 非管理员用户则只能看自己的
      if (
        user.userType !== EBackendUserType.ADMIN ||
        userId !== EDefaultSelect.ALL
      ) {
        db.andWhere('product.backendUserUserId =:userId', {
          userId: (userId !== EDefaultSelect.ALL && userId) || user.userId,
        });
      }

      // 按分类名查找
      if (categoriesId) {
        const categories = await this.backendCategoriesService.findById(
          categoriesId,
        );
        if (!categories)
          await Promise.reject({ message: '当前选择的商品分类不正确' });
        db.andWhere('product.categoriesId =:id', { id: categories.id });
      }

      // 按状态查找
      if (productStatus !== EDefaultSelect.ALL) {
        db.andWhere('product.productStatus =:status', {
          status: productStatus,
        });
      }

      // 按金额查找
      if (minAmount || maxAmount) {
        let sqlStr: string = '';
        let params: { max?: number; min?: number } = {};
        if (minAmount) {
          sqlStr = 'productDetail.productAmount>=:min';
          params.min = minAmount;
        }
        if (maxAmount) {
          sqlStr = 'productDetail.productAmount<=:max';
          params.max = maxAmount;
        }
        if (maxAmount && minAmount) {
          sqlStr =
            'productDetail.productAmount>=:min AND productDetail.productAmount<=:max';
        }
        db.innerJoinAndSelect(
          'product.productDetail',
          'productDetail',
          sqlStr,
          params,
        );
      }

      db.leftJoinAndMapOne(
        'product.backendUser',
        'product.backendUser',
        'backendUser',
      );
      db.leftJoinAndMapOne(
        'product.categories',
        'product.categories',
        'categories',
      );

      const data = await db.getMany();

      const list: Array<IProductItemResponse> = data
        .slice(minIndex, maxIndex)
        .map(
          ({
            id,
            backendUser,
            categories,
            productDetail,
            createTime,
            updateTime,
          }: Product) => ({
            productId: id,
            username: backendUser.username,
            categoriesName: categories.categoriesName,
            productAmount: productDetail.productAmount,
            productBrief: productDetail.productBrief,
            createTime,
            updateTime,
          }),
        );
      return { list, total: data.length };
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 过滤非正常的数据
   * @param data
   */
  filterArray<T>(data: Array<T>) {
    return data.filter((item: T) => !!item);
  }
}
