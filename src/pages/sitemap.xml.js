import { getPublishedPosts, getPostPath } from '../lib/posts';

export async function GET({ site }) {
  const posts = await getPublishedPosts();
  const staticPages = ['/', '/blog/', '/about/', '/podcast/', '/zh/', '/zh/blog/', '/zh/about/', '/zh/podcast/'];
  const urls = [
    ...staticPages.map((pathname) => new URL(pathname, site)),
    ...posts.map((post) => new URL(getPostPath(post), site))
  ];

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
