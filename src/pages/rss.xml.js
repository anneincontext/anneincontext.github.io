import { getPublishedPosts, getPostPath } from '../lib/posts';

export async function GET({ site }) {
  const posts = await getPublishedPosts();
  const items = posts.map((post) => {
    const url = new URL(getPostPath(post), site);
    return `
      <item>
        <title><![CDATA[${post.data.title}]]></title>
        <description><![CDATA[${post.data.description}]]></description>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${post.data.date.toUTCString()}</pubDate>
      </item>`;
  }).join('');

  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Anne</title>
        <description>Anne 的个人主页与博客。</description>
        <link>${site}</link>
        ${items}
      </channel>
    </rss>`, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
