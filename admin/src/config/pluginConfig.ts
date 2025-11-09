import { defaultTheme } from '../theme';
import type { PluginConfig, UserPluginConfig, Preset, Theme } from './types';

const PLUGIN_CONFIG: PluginConfig = {
  theme: defaultTheme,
};

/**
 * Sets a configuration for the plugin.
 *
 * @remarks
 *
 * - Function must be invoked before the admin panel's bootstrap lifecycle function.
 * The recommended way is to invoke it within the admin panel's register lifecycle function.
 *
 * - Provided properties will overwrite the default configuration values.
 *
 * @param userConfig - Plugin configuration object.
 */
export function setPluginConfig(userPluginConfig: UserPluginConfig): void {
  const { theme: userTheme } = userPluginConfig || {};

  if (userTheme) {
    PLUGIN_CONFIG.theme = userTheme;
  }
}

/**
 * Retrieves current plugin configuration.
 *
 * @internal
 */
export function getPluginConfig(): PluginConfig {
  return PLUGIN_CONFIG;
}
