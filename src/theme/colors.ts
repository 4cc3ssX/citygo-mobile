export type ColorKeys = keyof (typeof lightColors & typeof darkColors);

export const lightColors = {
  text: '#091013',
  primary: '#417CEF',
  error: '#E51515',
  errorBackground: '#FDE8E8',
  warning: '#F19F00',
  warningBackground: '#FFEED9',
  info: '#4482E0',
  infoBackground: '#ECF3FC',
  background: '#F6F6F6',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#DDDDDD',
  hint: '#9C9C9C',
} as const;

export const darkColors = {
  text: '#091013',
  primary: '#417CEF',
  error: '#E51515',
  errorBackground: '#FDE8E8',
  warning: '#F19F00',
  warningBackground: '#FFEED9',
  info: '#4482E0',
  infoBackground: '#ECF3FC',
  background: '#F6F6F6',
  white: '#FFFFFF',
  surface: '#FFFFFF',
  border: '#DDDDDD',
  hint: '#9C9C9C',
} as const;
