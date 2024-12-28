import { Fetcher } from '../_libs/fetcher'

export const fetcherAdmin = new Fetcher({
  baseUrl: '/api/admin',
  unAuthRedirectUrl: '/admin/login',
})

export const fetcherShop = new Fetcher({
  baseUrl: '/api/shop',
  unAuthRedirectUrl: '/login',
})
