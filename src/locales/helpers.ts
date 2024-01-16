export type supportedLng = 'en' | 'mm';

export type ISupportedLanguageType = {
  [key in supportedLng]: string;
};

export const SupportedLanguages: ISupportedLanguageType = {
  en: 'English',
  mm: 'မြန်မာ',
};
