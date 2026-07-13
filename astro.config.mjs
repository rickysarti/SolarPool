import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.solarpool.com.ar',
  integrations: [
    sitemap({
      // Excluir páginas internas / scaffolds que no deben indexarse.
      filter: (page) =>
        !page.includes('/productos/cobertores-solares-termicos/template'),
      changefreq: 'weekly',
      lastmod: new Date(),
      // Prioridades y frecuencia por tipo de página.
      serialize(item) {
        const url = item.url;
        if (url === 'https://www.solarpool.com.ar/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (url.includes('/productos/cobertores-solares-termicos/medidas/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (url.includes('/productos/')) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (url.includes('/blog/')) {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
});
