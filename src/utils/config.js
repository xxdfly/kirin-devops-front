module.exports = {
  siteName: 'Kirin Devops',
  copyright: 'Kirin Devops © 2018 xiaodong.xuexd',
  logoPath: '/logo.ico',
  apiPrefix: '/api/sys',
  fixedHeader: true, // sticky primary layout header
  iconFontUrl: '//at.alicdn.com/t/font_1050820_dvnpm9iepqn.js',

  /* Layout configuration, specify which layout to use for route. */
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exlude: [/(\/(en|zh))*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'en',
  },
}
