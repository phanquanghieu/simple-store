import { IAdminRes } from '~/shared/dto/admin/req'

import { OkRes } from '../common'

export const adminService = {
  me: async () => {
    return OkRes<IAdminRes>({
      username: process.env.ADMIN_USERNAME!,
    })
  },
}
