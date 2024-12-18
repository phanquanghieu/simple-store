export const queryUtil = {
  skipTake: <T extends { page: number; size: number }>({ page, size }: T) => {
    return {
      skip: (page - 1) * size,
      take: size,
    }
  },
  orderBy: <T extends { sort: string[][] }>({ sort }: T) => {
    return {
      orderBy: sort.map((s) => ({
        [s[0]]: s[1],
      })),
    }
  },
  skipTakeOrder: <T extends { page: number; size: number; sort: string[][] }>(
    query: T,
  ) => {
    return {
      ...queryUtil.skipTake(query),
      ...queryUtil.orderBy(query),
    }
  },
}
