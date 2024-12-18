import { Brand } from '@prisma/client'

export interface ICreateBrandBody extends Pick<Brand, 'name' | 'description'> {}

export interface IUpdateBrandBody extends Partial<ICreateBrandBody> {}
