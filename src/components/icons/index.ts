import {bell} from './bell';
import {bellBroken} from './bell-broken';
import {book} from './book';
import {home, homeOutline} from './home';
import {map, mapOutline} from './map';
import {services, servicesOutline} from './service';
import {settings, settingsOutline} from './settings';
import {user} from './user';

export type IconKeys = keyof typeof icons;

export const icons = {
  bell,
  'bell-broken': bellBroken,
  home,
  'home-outline': homeOutline,
  services,
  'services-outline': servicesOutline,
  map,
  'map-outline': mapOutline,
  settings,
  'settings-outline': settingsOutline,
  user,
  book,
} as const;

export * from './Icon';
