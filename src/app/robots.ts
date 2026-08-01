import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * AI 검색·생성 크롤러.
 * 와일드카드 규칙으로도 이미 허용되지만, 봇 이름을 명시해 두면
 * (1) 수집 허용이 명시적 정책으로 남고 (2) 나중에 개별 봇만 막기 쉽다.
 * 기본 크롤 정책은 `*` 규칙 하나로 충분하므로 여기서는 allow만 나열한다.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'Applebot-Extended',
  'meta-externalagent',
  'Amazonbot',
  'DuckAssistBot',
  'YouBot',
  'cohere-ai',
  'CCBot',
  'Diffbot',
  'Timpibot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
