import {bell} from './bell';
import {home, homeOutline} from './home';
import {map, mapOutline} from './map';
import {services, servicesOutline} from './service';
import {settings, settingsOutline} from './settings';

export type IconKeys = keyof typeof icons;

export const icons = {
  bell,
  home,
  'home-outline': homeOutline,
  services,
  'services-outline': servicesOutline,
  map,
  'map-outline': mapOutline,
  settings,
  'settings-outline': settingsOutline,
} as const;

export * from './Icon';
