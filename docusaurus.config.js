// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cat sitting for beginners',
  tagline: 'A comprehensive guide to cat sitting',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://ch4s3r.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/cat_sitting_book/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Ch4s3r', // Usually your GitHub org/user name.
  projectName: 'cat_sitting_book', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/', // Serve the docs at the site's root
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    function(context, options) {
      return {
        name: 'single-bundle',
        configureWebpack(config, isServer) {
          if (!isServer) {
            return {
              optimization: {
                ...config.optimization,
                splitChunks: {
                  chunks: 'all',
                  minSize: 0,
                  maxSize: 0,
                  cacheGroups: {
                    default: {
                      name: 'main',
                      chunks: 'all',
                      enforce: true,
                    },
                  },
                },
                runtimeChunk: false,
              },
            };
          }
          return {};
        },
      };
    },
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
          'mobile',
        ],
        injectManifestConfig: {
          globPatterns: ['**/*.{css,js,html,png,jpg,jpeg,gif,svg,woff,woff2,eot,ttf,otf}'],
          modifyURLPrefix: {},
          manifestTransforms: [],
          maximumFileSizeToCacheInBytes: 10000000, // 10MB
        },
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/favicon.ico',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#25c2a0',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'default',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/cat-icon-192.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/img/cat-icon.svg',
            color: '#25c2a0',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/img/cat-icon-192.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#25c2a0',
          },
        ],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Cat Sitting Guide',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Guide',
          },
          {
            href: 'https://github.com/Ch4s3r/cat_sitting_book',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Cat Sitting Guide',
                to: '/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Cat Sitting Guide. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
