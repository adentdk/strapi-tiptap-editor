import pluginPkg from '../../package.json';
import { Core } from '@strapi/strapi';

export default {
  register: ({ strapi }: { strapi: Core.Strapi }) => {
    strapi.customFields.register({
      name: "full-tiptap-editor",
      plugin: pluginPkg.strapi.name,
      type: "json",
      inputSize: {
        default: 8,
        isResizable: true,
      },
    });

    strapi.customFields.register({
      name: "simple-tiptap-editor",
      plugin: pluginPkg.strapi.name,
      type: "json",
      inputSize: {
        default: 8,
        isResizable: true,
      },
    })
  }
}
