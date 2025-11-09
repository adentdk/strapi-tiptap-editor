import cloneDeep from 'lodash/cloneDeep';

import { defaultTheme } from './theme';

const clonedDefaultTheme = cloneDeep(defaultTheme);

export { clonedDefaultTheme as defaultTheme };

export type {
  UserPluginConfig as PluginConfig,
  Preset,
  Theme,
  EditorStyles,
} from './config/types';

export { setPluginConfig } from './config';
export { StrapiMediaLib, StrapiUploadAdapter } from './plugins';
