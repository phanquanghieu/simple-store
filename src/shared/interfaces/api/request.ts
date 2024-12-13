export interface IIdParam {
  id: string
}

export interface IPaginationQuery {
  page: number
  size: number
}

export interface ISortQuery {
  sort: string
}

export interface ISearchQuery {
  search?: string
}
