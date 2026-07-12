import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  NotebookText,
} from 'lucide-react';
import { getDictionary, resolveLocale } from '@/lib/i18n';
import { siteConfig } from '@/lib/site';
import { metadataAlternates } from '@/lib/routes';

type LangParams = Promise<{ lang: string }>;

export async function generateMetadata({
  params,
}: {
  params: LangParams;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = resolveLocale(lang);
  const dict = getDictionary(locale);
  return {
    title: dict.about.title,
    description: dict.about.subtitle,
    alternates: metadataAlternates(locale, '/about'),
  };
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-line py-8 last:border-0">
      <h2 className="mb-5 flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-wider text-muted">
        <span className="h-0.5 w-3.5 bg-signal" aria-hidden="true" />
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function AboutPage({ params }: { params: LangParams }) {
  const { lang } = await params;
  const dict = getDictionary(resolveLocale(lang));

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
      text: 'seungahhong-portfolio.vercel.app',
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
      <header className="flex flex-col items-start gap-6 border-b border-line py-12 sm:flex-row sm:items-center sm:gap-8">
        <div className="relative h-28 w-28 flex-none overflow-hidden rounded-full border border-line bg-surface-2 sm:h-32 sm:w-32">
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
          <p className="mb-2 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
            {dict.about.eyebrow}
          </p>
          <h1 className="text-[clamp(24px,3vw,34px)] font-extrabold tracking-tight text-ink">
            {dict.about.title}
          </h1>
          <p className="mt-2.5 max-w-[48ch] text-[15px] text-muted">
            {dict.about.subtitle}
          </p>
        </div>
      </header>

      <Section title={dict.about.introHeading}>
        <ul className="flex flex-col gap-2.5 text-[16px] leading-relaxed text-ink">
          {dict.about.intro.map((line) => (
            <li key={line} className="flex gap-2.5">
              <span
                className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-signal"
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
              <h3 className="mb-2.5 text-[13px] font-bold text-ink">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-line bg-surface-2 px-2.5 py-1 font-mono text-[12.5px] text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={dict.about.linksHeading}>
        <ul className="flex flex-col divide-y divide-line">
          {links.map(({ label, href, Icon, text }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={
                  href.startsWith('mailto:') ? undefined : 'noreferrer noopener'
                }
                className="group flex items-center gap-3 py-3 text-ink transition-colors hover:text-accent"
              >
                <Icon
                  className="h-4 w-4 text-muted group-hover:text-accent"
                  aria-hidden="true"
                />
                <span className="w-24 flex-none text-[14px] font-semibold">
                  {label}
                </span>
                <span className="truncate font-mono text-[13px] text-muted group-hover:text-accent">
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
