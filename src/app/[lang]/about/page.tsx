import type { Metadata } from 'next';
import Image from 'next/image';
import { ExternalLink, Mail, NotebookText } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons/BrandIcons';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import { getAllPosts } from '@/lib/posts';
import { siteConfig } from '@/lib/site';
import { sectionMetadata } from '@/lib/metadata';
import {
  faqPageJsonLd,
  profilePageJsonLd,
  sectionBreadcrumbJsonLd,
} from '@/lib/jsonld';
import JsonLd from '@/components/JsonLd';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';

type LangParams = Promise<{ lang: string }>;

export async function generateMetadata({
  params,
}: {
  params: LangParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  return sectionMetadata({
    locale,
    sub: '/about',
    title: dict.about.title,
    description: dict.about.subtitle,
    type: 'profile',
  });
}

/**
 * FAQ 답변의 `{postCount}` · `{since}` 자리표시자를 실제 값으로 채운다.
 * 사전에 숫자를 하드코딩하면 글이 늘 때마다 답변이 사실과 어긋나기 때문이다.
 */
function resolveFaq(dict: Dictionary, locale: Locale) {
  const postCount = getAllPosts(locale).length;
  return dict.about.faq.map((item) => ({
    question: item.question,
    answer: item.answer
      .replace('{postCount}', String(postCount))
      .replace('{since}', String(siteConfig.since)),
  }));
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-line border-b py-8 last:border-0">
      <h2 className="text-muted mb-5 flex items-center gap-2 font-mono text-[12px] font-semibold tracking-wider uppercase">
        <span className="bg-signal h-0.5 w-3.5" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function AboutPage({ params }: { params: LangParams }) {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  const faq = resolveFaq(dict, locale);

  const links = [
    {
      label: 'GitHub',
      href: siteConfig.social.github,
      Icon: Github,
      text: 'github.com/seungahhong',
    },
    {
      label: 'Portfolio',
      href: siteConfig.social.portfolio,
      Icon: ExternalLink,
      text: 'seungah-portfolio.vercel.app',
    },
    {
      label: 'LinkedIn',
      href: siteConfig.social.linkedin,
      Icon: Linkedin,
      text: 'linkedin.com/in/seungahhong',
    },
    {
      label: 'Notion',
      href: siteConfig.social.notion,
      Icon: NotebookText,
      text: 'Notion',
    },
    {
      label: 'Email',
      href: `mailto:${siteConfig.social.email}`,
      Icon: Mail,
      text: siteConfig.social.email,
    },
  ];

  return (
    <div className="mx-auto max-w-[860px] px-[18px] pb-11 md:px-[34px]">
      <JsonLd data={profilePageJsonLd(locale, dict)} />
      <JsonLd data={faqPageJsonLd(locale, faq)} />
      <JsonLd
        data={sectionBreadcrumbJsonLd(locale, dict, {
          name: dict.nav.about,
          sub: '/about',
        })}
      />
      <header className="border-line flex flex-col items-start gap-6 border-b py-12 sm:flex-row sm:items-center sm:gap-8">
        <div className="border-line bg-surface-2 relative h-28 w-28 flex-none overflow-hidden rounded-full border sm:h-32 sm:w-32">
          <Image
            src="/profile.webp"
            alt={dict.about.title}
            fill
            sizes="128px"
            className="object-cover"
            priority
          />
        </div>
        <div>
          <p className="text-accent mb-2 font-mono text-[12px] tracking-[0.16em] uppercase">
            {dict.about.eyebrow}
          </p>
          <h1 className="text-ink text-[clamp(24px,3vw,34px)] font-extrabold tracking-tight">
            {dict.about.title}
          </h1>
          <p className="text-muted mt-2.5 max-w-[48ch] text-[15px]">
            {dict.about.subtitle}
          </p>
        </div>
      </header>

      <Section title={dict.about.introHeading}>
        <ul className="text-ink flex flex-col gap-2.5 text-[16px] leading-relaxed">
          {dict.about.intro.map((line) => (
            <li key={line} className="flex gap-2.5">
              <span
                className="bg-signal mt-2 h-1.5 w-1.5 flex-none rounded-full"
                aria-hidden="true"
              />
              {line}
            </li>
          ))}
        </ul>
      </Section>

      <Section title={dict.about.skillsHeading}>
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {dict.about.skills.map((group) => (
            <div key={group.label}>
              <h3 className="text-ink mb-2.5 text-[13px] font-bold">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="border-line bg-surface-2 text-ink rounded-md border px-2.5 py-1 font-mono text-[12.5px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={dict.about.faqHeading}>
        <ul className="flex flex-col gap-6">
          {faq.map((item) => (
            <li key={item.question}>
              <h3 className="text-ink mb-1.5 text-[15px] font-bold">
                {item.question}
              </h3>
              <p className="text-muted max-w-[68ch] text-[14.5px] leading-relaxed">
                {item.answer}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={dict.about.linksHeading}>
        <ul className="divide-line flex flex-col divide-y">
          {links.map(({ label, href, Icon, text }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={
                  href.startsWith('mailto:') ? undefined : 'noreferrer noopener'
                }
                className="group text-ink hover:text-accent flex items-center gap-3 py-3 transition-colors"
              >
                <Icon
                  className="text-muted group-hover:text-accent h-4 w-4"
                  aria-hidden="true"
                />
                <span className="w-24 flex-none text-[14px] font-semibold">
                  {label}
                </span>
                <span className="text-muted group-hover:text-accent truncate font-mono text-[13px]">
                  {text}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
