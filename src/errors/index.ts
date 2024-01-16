import {AxiosError} from 'axios';

export class UnableToConnectError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ConnectionTimeOutError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function axiosErrorHandler<T extends {}, D = any>(
  err: AxiosError<T, D>,
) {
  if (err.code === 'ECONNABORTED') {
    throw new ConnectionTimeOutError('Connection time out.');
  }

  if (err.code === 'ERR_NETWORK') {
    throw new UnableToConnectError('Unable to connect.');
  }
}
