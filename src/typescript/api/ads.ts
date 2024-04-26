import {ReplaceValueByType} from '@typescript';

import {ILocalizedString} from '.';

export enum AdType {
  BANNER = 'banner',
  APP_OPEN = 'app-open',
}

export type AdImage = {
  url: string;
  blurhash: string | null | undefined;
};

export interface IAds {
  type: AdType;
  image: AdImage;
  url: string;
  expireAt: number | null;
}

export type IAdSearchType = Pick<
  Partial<ReplaceValueByType<IAds, ILocalizedString, string>>,
  'type'
>;
