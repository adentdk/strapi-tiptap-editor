import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from './pluginId';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: "full-tiptap-editor",
    plugin: PLUGIN_ID,
    type: "json",
    inputSize: {
      default: 8,
      isResizable: true,
    },
  });

  strapi.customFields.register({
    name: "simple-tiptap-editor",
    plugin: PLUGIN_ID,
    type: "json",
    inputSize: {
      default: 8,
      isResizable: true,
    },
  });
};

export default register;
