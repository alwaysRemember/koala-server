/*
 * @Author: Always
 * @LastEditors: Always
 * @Date: 2020-07-17 15:21:36
 * @LastEditTime: 2020-08-10 15:35:43
 * @FilePath: /koala-server/src/backstage/service/BackendProductService.ts
 */
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream, accessSync, unlinkSync, statSync } from 'fs';
import {
  IUploadProductBanner,
  IUploadProductVideo,
  IProductResponse,
  IUploadProductMainImg,
  IUpdateProductStatus,
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
import {
  EProductStatus,
  EDefaultSelect,
  EProductStatusTransfer,
} from 'src/global/enums/EProduct';
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
  IProductByIdItem,
} from '../interface/IProductList';
import { Categories } from 'src/global/dataobject/Categories.entity';
import { ProductMainImg } from 'src/global/dataobject/ProductMainImg.entity';
import { ProductMainImgRepository } from 'src/global/repository/ProductMainImgRepository';
import { Mail } from 'src/utils/Mail';
import { reportErr } from 'src/utils/ReportError';
import UploadFile from 'src/utils/UploadFile';

@Injectable()
export class BackendProductService {
  constructor(
    private readonly productBannerRepository: ProductBannerRepository,
    private readonly productVideoRepository: ProductVideoRepository,
    private readonly productRepository: ProductRepository,
    private readonly productDetailRepository: ProductDetailRepository,
    private readonly productMainImgRepository: ProductMainImgRepository,
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
    const uploadFile = new UploadFile(fileName, 'IMAGE');
    let filePath: string;

    try {
      filePath = uploadFile.save(file);

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
      uploadFile.delate();
      throw new BackendException('上传banner失败', e.message);
    }
  }

  /**
   * 上传视频文件
   * @param file
   */
  async uploadProductVideo(file: File): Promise<IUploadProductVideo> {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    const uploadFile = new UploadFile(fileName, 'VIDEO');
    let filePath: string;
    try {
      filePath = uploadFile.save(file);
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
      uploadFile.delate();
      throw new BackendException('上传视频失败', e.message);
    }
  }

  /**
   * 上传产品主图
   * @param file
   */
  async uploadProductMainImg(file: File): Promise<IUploadProductMainImg> {
    const fileName = `${new Date().getTime()}_${file.originalname}`;
    let filePath: string;
    const uploadFile = new UploadFile(fileName, 'IMAGE');
    try {
      filePath = uploadFile.save(file);

      const img = new ProductMainImg();
      img.path = `${HOST}/image/${fileName}`;
      img.relativePath = filePath;
      img.fileName = fileName;
      const { identifiers } = await this.productMainImgRepository.insert(img);
      return {
        id: identifiers[0].id,
        name: file.originalname,
        url: img.path,
        size: file.size,
      };
    } catch (e) {
      uploadFile.delate();
      throw new BackendException('上传主图失败', e.message);
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
          where: {
            id: data.productId,
          },
        });
        if (!defaultProduct) {
          throw new BackendException('查询不到此商品');
        }
        if (defaultProduct.isDel) {
          throw new BackendException('此商品已删除');
        }

        defaultProductDetail = await this.productDetailRepository.findOne({
          where: {
            id: defaultProduct.productDetailId,
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

      // 关联产品主图
      if (data.mainImgId) {
        const mainImg = await this.productMainImgRepository.findOne(
          data.mainImgId,
        );
        if (mainImg) {
          product.productMainImgId = mainImg.id;
        } else {
          throw new BackendException('未找到对应的产品主图');
        }
      }

      // 写入数据
      return await getManager()
        .transaction(async (entityManage: EntityManager) => {
          // 保存详情
          const { id } = await entityManage.save(ProductDetail, productDetail);
          product.productDetailId = id;
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
          // 判断主图是否更改
          if (data.delMainImgIdList?.length) {
            const delMainImgIdList: Array<ProductMainImg> = await this.productMainImgRepository.find(
              {
                id: In(data.delMainImgIdList),
              },
            );
            delMainImgIdList.forEach(async item => {
              const { relativePath } = item;
              await this.productMainImgRepository.remove(item);
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
  async getProductDetail(productId: string): Promise<IProductResponse> {
    try {
      const product = await this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndMapOne(
          'product.categories',
          'product.categories',
          'categories',
        )
        .leftJoinAndMapMany(
          'product.productBanner',
          'product.productBanner',
          'productBanner',
        )
        .leftJoinAndMapMany(
          'product.productVideo',
          'product.productVideo',
          'productVideo',
        )
        .where('product.id = :id', { id: productId })
        .getOne();

      if (!product) {
        throw new BackendException('查询不到此商品');
      }

      const detail = await this.productDetailRepository.findOne(
        product.productDetailId,
      );
      const mainImg = await this.productMainImgRepository.findOne(
        product.productMainImgId,
      );

      if (!detail) {
        throw new BackendException('查询不到商品信息');
      }
      if (!mainImg) {
        throw new BackendException('查询不到商品主图');
      }

      // 判断是否删除
      if (product.isDel) {
        throw new BackendException('商品已删除');
      }

      const {
        productName: name,
        productStatus,
        categories: { id: categoriesId },
        productVideo,
      } = product;

      const {
        productAmount: amount,
        productContent: productDetail,
        productBrief,
      } = detail;

      return {
        name,
        productStatus,
        categoriesId,
        amount,
        productBrief,
        productDetail,
        bannerList: product.productBanner.map(
          ({ id, fileName: name, path: url, size }) => ({
            id,
            name,
            url,
            size,
          }),
        ),
        videoData: productVideo && {
          id: productVideo[0].id,
          name: productVideo[0].fileName,
          url: productVideo[0].path,
        },
        mainImg: {
          id: mainImg.id,
          name: mainImg.fileName,
          url: mainImg.path,
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
      productId,
    }: IProductListRequest,
    token: string,
  ): Promise<{ total: number; list: Array<IProductItemResponse> }> {
    // 分页参数

    try {
      // 判断token是否存在
      const userStr = await this.redisService.get(token);
      if (!userStr) await reportErr('用户登录态不正确');

      const { userId: tokenUserId }: BackendUser = JSON.parse(userStr);
      const db = this.productRepository
        .createQueryBuilder('product')
        .select([
          'product.id as productId',
          'productName',
          'productStatus',
          'isDel',
          'product.createTime as createTime',
          'product.updateTime as updateTime',
          'mainImg.path as productMainImg',
          'user.username as username',
          'categories.categoriesName as categoriesName',
          'detail.productAmount as productAmount',
          'detail.productBrief as productBrief',
        ]);

      db.leftJoin(
        ProductMainImg,
        'mainImg',
        'mainImg.id = product.productMainImgId',
      );
      db.leftJoin(
        BackendUser,
        'user',
        'user.userId = product.backendUserUserId',
      );
      db.leftJoin(
        Categories,
        'categories',
        'categories.id = product.categoriesId',
      );
      db.leftJoin(
        ProductDetail,
        'detail',
        'detail.id = product.productDetailId',
      );

      // 按状态查找
      if (productStatus !== EDefaultSelect.ALL) {
        db.andWhere('product.productStatus =:status', {
          status: productStatus,
        });
      }
      // 过滤掉删除的商品
      db.andWhere('product.isDel = 0');

      if (productId) {
        db.andWhere('product.id =:id', { id: productId });
      }

      // 用户查表
      const user = await this.backendUserService.backendFindByUserId(
        tokenUserId,
      );
      if (!user) await reportErr('用户不存在');

      // 非管理员用户则只能看自己的 || 选择了某个用户的数据
      if (
        user.userType !== EBackendUserType.ADMIN ||
        userId !== EDefaultSelect.ALL
      ) {
        db.andWhere('product.backendUserUserId =:userId', {
          userId: (userId !== EDefaultSelect.ALL && userId) || user.userId,
        });
      }

      // 按分类名查找
      if (categoriesId && categoriesId !== EDefaultSelect.ALL) {
        const categories = await this.backendCategoriesService.findById(
          categoriesId,
        );
        if (!categories) await reportErr('当前选择的商品分类不正确');
        db.andWhere('product.categoriesId =:id', { id: categories.id });
      }

      // 按金额查找
      if (minAmount || maxAmount) {
        let sqlStr: string = '';
        let params: { max?: number; min?: number } = {};
        if (minAmount) {
          sqlStr = 'detail.productAmount>=:min';
          params.min = minAmount;
        }
        if (maxAmount) {
          sqlStr = 'detail.productAmount<=:max';
          params.max = maxAmount;
        }
        if (maxAmount && minAmount) {
          sqlStr = 'detail.productAmount>=:min AND detail.productAmount<=:max';
        }
        db.andWhere(sqlStr, params);
      }

      const data = await db
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .addOrderBy('product.updateTime', 'ASC')
        .getRawMany();
      const total = await db.getCount();

      return { list: data, total };
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 根据id进行删除产品（状态置为删除）
   * @param productId
   */
  async delProduct(productId: string) {
    try {
      const product = await this.productRepository.findOne(productId);
      if (!product) {
        await reportErr('查询不到此商品');
      }
      product.isDel = true; // 设置删除状态
      product.productStatus = EProductStatus.OFF_SHELF; // 设置下架

      await this.productRepository.save(product);
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 获取审核中的产品
   */
  async getProductReviewList({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<{
    total: number;
    list: Array<IProductItemResponse>;
  }> {
    try {
      const db = this.productRepository.createQueryBuilder('product');

      db.select([
        'product.id as productId',
        'product.productName as productName',
        'mainImg.path as productMainImg',
        'product.productStatus as productStatus',
        'user.username as username',
        'categories.categoriesName as categoriesName',
        'detail.productAmount as productAmount',
        'detail.productBrief as productBrief',
        'product.createTime as createTime',
        'product.updateTime as updateTime',
      ]);
      db.leftJoin(
        ProductMainImg,
        'mainImg',
        'mainImg.id = product.productmainImgId',
      );
      db.leftJoin(
        BackendUser,
        'user',
        'user.userId = product.backendUserUserId',
      );
      db.leftJoin(
        Categories,
        'categories',
        'categories.id = product.categoriesId',
      );
      db.leftJoin(
        ProductDetail,
        'detail',
        'detail.id = product.productDetailId',
      );
      db.where('product.isDel = 0');
      db.andWhere(`product.productStatus=:status`, {
        status: EProductStatus.UNDER_REVIEW,
      });

      const list = await db
        .skip((page - 1) * pageSize)
        .take(pageSize)
        .addOrderBy('product.updateTime', 'ASC')
        .getRawMany();
      const total = await db.getCount();

      return { list, total };
    } catch (e) {
      throw new BackendException('获取审核中商品失败', e);
    }
  }

  /**
   * 更新产品状态
   * @param param
   */
  async updateProductStatus({
    productId,
    productStatus,
  }: IUpdateProductStatus) {
    try {
      let product: Product;
      try {
        product = await this.productRepository.findOne(productId, {
          join: {
            alias: 'product',
            leftJoinAndSelect: {
              backendUser: 'product.backendUser',
            },
          },
        });
      } catch (e) {
        await reportErr('没有查询到对应的商品', e);
      }

      if (!product) {
        await reportErr('产品信息获取失败');
      }
      // 判断传入的状态
      switch (productStatus) {
        case EProductStatus.OFF_SHELF:
          product.productStatus = EProductStatus.OFF_SHELF;
          break;
        case EProductStatus.PUT_ON_SHELF:
          product.productStatus = EProductStatus.PUT_ON_SHELF;
          break;
        default:
          await reportErr(`${productStatus}非合法的状态`);
      }
      await this.productRepository.save(product);

      /**
       * 判断是否有邮箱
       */
      if (!product?.backendUser?.email) {
        return;
      }
      // 状态变更后通知产品所属人
      new Mail(
        '产品状态变更',
        {
          产品ID: product.id,
          变更结果: EProductStatusTransfer[product.productStatus],
          产品名称: product.productName,
        },
        product.backendUser.email,
      ).send();
    } catch (e) {
      throw new BackendException(e.message, e);
    }
  }

  /**
   * 根据产品id获取产品
   * @param param0
   */
  async getProductByProductId(productId: string) {
    try {
      try {
        const db = this.productRepository.createQueryBuilder('product');
        db.select(['product.id as id', 'product.productName as productName']);
        db.where('product.id = :id', { id: productId });
        let list: Array<IProductByIdItem> = await db.getRawMany();
        return list;
      } catch (e) {
        await reportErr('获取商品失败', e);
      }
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
