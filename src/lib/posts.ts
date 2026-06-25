import { getCollection } from 'astro:content';
import type { Lang } from './locales';

export async function getPublishedPosts(lang?: Lang) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const filtered = lang ? posts.filter((post) => post.data.lang === lang) : posts;

  return filtered.sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
}

export function formatDate(date: Date, lang: Lang = 'en') {
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function getPostPath(post: { id: string; data: { legacyPath?: string; lang: Lang } }) {
  if (post.data.legacyPath) return post.data.legacyPath;
  return post.data.lang === 'zh' ? `/zh/blog/${post.id}/` : `/blog/${post.id}/`;
}
