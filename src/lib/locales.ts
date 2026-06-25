export type Lang = 'en' | 'zh';

export const locales = {
  en: {
    lang: 'en',
    htmlLang: 'en',
    homePath: '/',
    blogPath: '/blog/',
    aboutPath: '/about/',
    podcastPath: '/podcast/',
    alternatePath: '/zh/',
    alternateLabel: '中文',
    blogLabel: 'Blog',
    aboutLabel: 'About',
    podcastLabel: 'Podcast',
    rssLabel: 'RSS',
    backToBlog: 'Back to Blog',
    description: 'Anne is a personal site and blog for engineering notes, writing, and long-lived context.',
    social: {
      x: 'https://x.com/anneincontext',
      linkedin: 'https://www.linkedin.com/in/annie01/',
      instagram: 'https://www.instagram.com/anne0210li/'
    }
  },
  zh: {
    lang: 'zh',
    htmlLang: 'zh-CN',
    homePath: '/zh/',
    blogPath: '/zh/blog/',
    aboutPath: '/zh/about/',
    podcastPath: '/zh/podcast/',
    alternatePath: '/',
    alternateLabel: 'English',
    blogLabel: '博客',
    aboutLabel: '关于',
    podcastLabel: '播客',
    rssLabel: 'RSS',
    backToBlog: '返回博客',
    description: 'Anne 的个人主页与博客，记录前端工程、写作和长期学习。',
    social: {
      x: 'https://x.com/anne_lyl',
      linkedin: 'https://www.linkedin.com/in/annie01/',
      instagram: 'https://www.instagram.com/anne0210li/'
    }
  }
} as const;

export function getLocale(lang: Lang = 'en') {
  return locales[lang];
}
