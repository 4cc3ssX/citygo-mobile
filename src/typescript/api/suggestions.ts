import {ReplaceValueByType} from '@typescript';

import {ICoordinates, ILocalizedString} from '.';

export interface ISuggestion extends ICoordinates {
  /**
   * The ID of the suggestion
   */
  id: number;
  /**
   * The name of the suggested place
   */
  name: ILocalizedString;
  /**
   * The region of the suggested place
   */
  region: string;
}

export type ISuggestionSearchType = Pick<
  Partial<ReplaceValueByType<ISuggestion, ILocalizedString, string>>,
  'name' | 'region'
>;
