import { has, isNil, omitBy, set } from 'lodash'
import querystring, { ParsedUrlQueryInput } from 'querystring'

export interface IFetcherOption extends Omit<RequestInit, 'body'> {
  query?: object
  body?: object
}

export class Fetcher {
  private baseUrl: string
  private unAuthRedirectUrl?: string

  constructor({
    baseUrl,
    unAuthRedirectUrl,
  }: {
    baseUrl: string
    unAuthRedirectUrl?: string
  }) {
    this.baseUrl = baseUrl
    this.unAuthRedirectUrl = unAuthRedirectUrl
  }

  async http<IDataRes = object>(
    path: string,
    { query, body, ...requestInit }: IFetcherOption = {},
  ): Promise<IDataRes> {
    let url = `${this.baseUrl}${path}`

    if (query) {
      const _query = omitBy(query, isNil)
      if (has(_query, 'sort')) {
        set(
          _query,
          'sort',
          (_query.sort as string[][]).map((s) => s.join(':')),
        )
      }
      url += `?${querystring.stringify(_query as ParsedUrlQueryInput)}`
    }

    const _requestInit: RequestInit = {
      ...requestInit,
      headers: {
        'content-type': 'application/json',
        ...requestInit.headers,
      },
    }
    if (body) {
      _requestInit.body = JSON.stringify(body)
    }

    const res = await fetch(url, _requestInit)

    if (this.unAuthRedirectUrl && [401, 403].includes(res.status)) {
      window.location.replace(this.unAuthRedirectUrl)
    }

    const data = await res.json()

    return data as IDataRes
  }
  async get<IDataRes = object>(path: string, option?: IFetcherOption) {
    return this.http<IDataRes>(path, option)
  }
  async post<IDataRes = object>(path: string, option?: IFetcherOption) {
    return this.http<IDataRes>(path, { method: 'POST', ...option })
  }
  async put<IDataRes = object>(path: string, option?: IFetcherOption) {
    return this.http<IDataRes>(path, { method: 'PUT', ...option })
  }
  async patch<IDataRes = object>(path: string, option?: IFetcherOption) {
    return this.http<IDataRes>(path, { method: 'PATCH', ...option })
  }
  async delete<IDataRes = object>(path: string, option?: IFetcherOption) {
    return this.http<IDataRes>(path, { method: 'DELETE', ...option })
  }
}
