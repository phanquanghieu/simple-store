import { IApiErrorRes } from '~/shared/interfaces/api/response'

/* eslint-disable @typescript-eslint/no-explicit-any */

type IExceptionOption =
  | {
      message?: string
      detail?: any
    }
  | string
  | undefined

export class HttpException extends Error {
  statusCode: number = 500
  error: string = 'HttpException'
  message: string = 'Http Exception'
  detail?: any

  constructor(
    statusCode: number,
    error: string,
    message: string,
    detail?: any,
  ) {
    super(message)
    this.statusCode = statusCode
    this.error = error
    this.message = message
    this.detail = detail
  }

  static getRes(): IApiErrorRes {
    return {
      error: 'InternalServerError',
      message: 'Internal Server Error',
    }
  }

  static getStatusCode() {
    return 500
  }

  static extractMessageAndDetail(option?: IExceptionOption): {
    message?: string
    detail?: any
  } {
    if (!option) {
      return {
        message: undefined,
        detail: undefined,
      }
    } else if (typeof option === 'string') {
      return {
        message: option,
        detail: undefined,
      }
    } else {
      return {
        message: option.message,
        detail: option.detail,
      }
    }
  }

  getStatusCode() {
    return this.statusCode
  }

  getRes(): IApiErrorRes {
    return {
      error: this.error,
      message: this.message,
      detail: this.detail,
    }
  }
}

export class BadRequestException extends HttpException {
  constructor(option?: IExceptionOption) {
    const { message = 'Bad Request', detail } =
      HttpException.extractMessageAndDetail(option)
    super(400, 'BadRequest', message, detail)
  }
}

export class UnauthorizedException extends HttpException {
  constructor(option?: IExceptionOption) {
    const { message = 'Unauthorized', detail } =
      HttpException.extractMessageAndDetail(option)
    super(401, 'Unauthorized', message, detail)
  }
}

export class ForbiddenException extends HttpException {
  constructor(option?: IExceptionOption) {
    const { message = 'Forbidden', detail } =
      HttpException.extractMessageAndDetail(option)
    super(403, 'Forbidden', message, detail)
  }
}

export class NotFoundException extends HttpException {
  constructor(option?: IExceptionOption) {
    const { message = 'Not Found', detail } =
      HttpException.extractMessageAndDetail(option)
    super(404, 'NotFound', message, detail)
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(option?: IExceptionOption) {
    const { message = 'Internal Server Error', detail } =
      HttpException.extractMessageAndDetail(option)
    super(500, 'InternalServerError', message, detail)
  }
}
