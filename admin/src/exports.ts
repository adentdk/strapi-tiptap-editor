import { defaultTheme } from './theme';

const clonedDefaultTheme = { ...defaultTheme };

export { clonedDefaultTheme as defaultTheme };

export type {
  UserPluginConfig as PluginConfig,
  Preset,
  Theme,
  EditorStyles,
} from './config/types';

export { setPluginConfig } from './config';
