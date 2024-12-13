/* eslint-disable @typescript-eslint/no-explicit-any */

interface ICtxAdmin {
  admin: { username: string }
}

interface ICtxShop {
  customer: { id: string }
}

interface ICtxParam<T> {
  param: T
}

interface ICtxQuery<T> {
  query: T
}

interface ICtxBody<T> {
  body: T
}

export interface ICtx
  extends ICtxAdmin,
    ICtxParam<any>,
    ICtxQuery<any>,
    ICtxBody<any> {}

export interface IAdminCtx<IParam = any, IQuery = any, IBody = any>
  extends ICtxAdmin,
    ICtxParam<IParam>,
    ICtxQuery<IQuery>,
    ICtxBody<IBody> {}

export interface IAdminCtxParam<IParam = any>
  extends ICtxAdmin,
    ICtxParam<IParam> {}

export interface IAdminCtxQuery<IQuery = any>
  extends ICtxAdmin,
    ICtxQuery<IQuery> {}

export interface IAdminCtxBody<IBody = any>
  extends ICtxAdmin,
    ICtxBody<IBody> {}

export interface IAdminCtxParamQuery<IParam = any, IQuery = any>
  extends ICtxAdmin,
    ICtxParam<IParam>,
    ICtxQuery<IQuery> {}

export interface IAdminCtxParamBody<IParam = any, IBody = any>
  extends ICtxAdmin,
    ICtxParam<IParam>,
    ICtxBody<IBody> {}

export interface IShopCtx<IQuery = any, IParam = any, IBody = any>
  extends ICtxShop,
    ICtxParam<IParam>,
    ICtxQuery<IQuery>,
    ICtxBody<IBody> {}

export interface IShopCtxParam<IParam = any>
  extends ICtxShop,
    ICtxParam<IParam> {}

export interface IShopCtxQuery<IQuery = any>
  extends ICtxShop,
    ICtxQuery<IQuery> {}

export interface IShopCtxBody<IBody = any> extends ICtxShop, ICtxBody<IBody> {}

export interface IShopCtxParamQuery<IParam = any, IQuery = any>
  extends ICtxShop,
    ICtxParam<IParam>,
    ICtxQuery<IQuery> {}

export interface IShopCtxParamBody<IParam = any, IBody = any>
  extends ICtxShop,
    ICtxParam<IParam>,
    ICtxBody<IBody> {}

export interface ICtx extends ICtxAdmin, ICtxShop {}
