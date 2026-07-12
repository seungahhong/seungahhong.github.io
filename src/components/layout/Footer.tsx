import { Github, Linkedin, NotebookText } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/lib/i18n';
import { siteConfig } from '@/lib/site';

export default function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();
  const socials = [
    { href: siteConfig.social.github, label: 'GitHub', Icon: Github },
    { href: siteConfig.social.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: siteConfig.social.notion, label: 'Notion', Icon: NotebookText },
  ];

  return (
    <footer className="mt-16 border-t border-line bg-bg">
      <div className="mx-auto flex max-w-deck flex-col gap-4 px-[18px] py-8 sm:flex-row sm:items-center sm:justify-between md:px-[34px]">
        <div>
          <p>
            <span className="text-[15px] font-extrabold tracking-tight text-ink">
              {dict.brand.name}
            </span>
          </p>
          <p className="mt-1.5 text-[12.5px] text-muted">
            {dict.footer.builtWith}
          </p>
          <p className="mt-0.5 text-[12px] text-faint">
            © {siteConfig.since}–{year} {dict.footer.rights}
          </p>
        </div>
        <nav aria-label="social" className="flex items-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              lang={locale === 'ko' ? undefined : 'en'}
              className="grid h-[34px] w-[34px] place-items-center rounded-lg border border-line bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
