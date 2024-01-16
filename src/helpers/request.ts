import Axios from 'axios';

import {Configs} from '@configs';

import {Storage} from './storage';

export interface IRequestProps {
  isPrivate: boolean;
  token?: string | null;
}

export const createRequest = (props?: IRequestProps) => {
  const {signal, abort: cancel} = new AbortController();
  const axios = Axios.create({
    baseURL: Configs.BASE_URL,
    signal,
    timeout: 30000,
  });

  if (props?.isPrivate) {
    // check and override token to prop
    if (!props.token) {
      const token = Storage.getItem(Configs.AUTH_TOKEN_KEY);
      props.token = token as string;
    }

    axios.defaults.headers.common.Authorization = `Bearer ${props.token}`;
  }
  return {axios, cancel};
};
