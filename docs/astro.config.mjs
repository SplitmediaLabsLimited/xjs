import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { createStarlightTypeDocPlugin } from 'starlight-typedoc';

const [publicTypeDoc, publicTypeDocSidebarGroup] = createStarlightTypeDocPlugin();
const [internalTypeDoc, internalTypeDocSidebarGroup] = createStarlightTypeDocPlugin();

const typeDocBase = {
  excludePrivate: true,
  excludeExternals: true,
  hideGenerator: true,
  readme: 'none',
  skipErrorChecking: true,
};

export default defineConfig({
  site: 'https://xjs.xsplit.com',
  outDir: '../dist/docs',
  integrations: [
    starlight({
      title: 'XJS Framework',
      logo: {
        src: './src/assets/img_logo_nav.png',
        alt: 'XSplit JS Framework',
        replacesTitle: true,
      },
      customCss: ['./src/styles/xjs.css'],
      plugins: [
        publicTypeDoc({
          entryPoints: ['./src/index.ts'],
          output: 'api',
          sidebar: {
            label: 'API Reference',
          },
          tsconfig: './tsconfig.json',
          typeDoc: typeDocBase,
        }),
        internalTypeDoc({
          entryPoints: ['./src'],
          output: 'internals',
          sidebar: {
            collapsed: true,
            label: 'Contributor Reference',
          },
          tsconfig: './tsconfig.json',
          typeDoc: {
            ...typeDocBase,
            entryPointStrategy: 'expand',
            readme: './docs/src/typedoc/internals.md',
          },
        }),
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Home', link: '/' },
            { label: 'Quick Start', link: '/quick-start/' },
            { label: 'Tutorials', link: '/tutorials/' },
            { label: 'Support', link: '/support/' },
            { label: 'Components', link: '/components/' },
          ],
        },
        {
          label: 'Components',
          items: [{ autogenerate: { directory: 'components' } }],
        },
        publicTypeDocSidebarGroup,
        internalTypeDocSidebarGroup,
      ],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/SplitmediaLabsLimited/xjs',
        },
      ],
    }),
  ],
});
