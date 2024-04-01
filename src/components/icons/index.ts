import {bell} from './bell';
import {bellBroken} from './bell-broken';
import {book} from './book';
import {bookmark} from './bookmark';
import {bus} from './bus';
import {chevronRightIcon} from './chevron-right';
import {gps} from './gps';
import {home, homeOutline} from './home';
import {map, mapOutline} from './map';
import {marker} from './marker';
import {pin} from './pin';
import {rightCircleIcon} from './right-circle';
import {services, servicesOutline} from './service';
import {settings, settingsOutline} from './settings';
import {user} from './user';
import {walk} from './walk';

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
  gps,
  pin,
  walk,
  bookmark,
  bus,
  marker,
  'chevron-right': chevronRightIcon,
  'right-circle': rightCircleIcon,
} as const;

export * from './Icon';
