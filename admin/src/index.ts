import './styles.css'
import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { EditIcon } from 'lucide-react';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });

    app.customFields.register({
      name: "full-tiptap-editor",
      pluginId: PLUGIN_ID, // the custom field is created by a PLUGIN_ID plugin
      type: "json", // the color will be stored as a string
      intlLabel: {
        id: `${PLUGIN_ID}.full-tiptap-editor.label`,
        defaultMessage: "Full Tiptap Editor",
      },
      intlDescription: {
        id: `${PLUGIN_ID}.full-tiptap-editor.description`,
        defaultMessage: "Tiptap Editor with full feature",
      },
      icon: PluginIcon,
      components: {
        Input: async () => await import('./components/FullEditorInput'),
      },
      options: {
        // declare options here
      },
    });

    app.customFields.register({
      name: "simple-tiptap-editor",
      pluginId: PLUGIN_ID, // the custom field is created by a PLUGIN_ID plugin
      type: "json", // the color will be stored as a string
      intlLabel: {
        id: `${PLUGIN_ID}.simple-tiptap-editor.label`,
        defaultMessage: "Simple Tiptap Editor",
      },
      intlDescription: {
        id: `${PLUGIN_ID}.simple-tiptap-editor.description`,
        defaultMessage: "Tiptap editor with minimal feature",
      },
      icon: PluginIcon,
      components: {
        Input: async () => await import('./components/SimpleEditorInput'),
      },
      options: {
        // declare options here
      },
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);

          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
