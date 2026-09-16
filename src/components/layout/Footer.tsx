import { NotebookText } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons/BrandIcons';
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
    <footer className="border-line bg-bg mt-16 border-t">
      <div className="max-w-deck mx-auto flex flex-col gap-4 px-[18px] py-8 sm:flex-row sm:items-center sm:justify-between md:px-[34px]">
        <div>
          <p>
            <span className="text-ink text-[15px] font-extrabold tracking-tight">
              {dict.brand.name}
            </span>
          </p>
          <p className="text-muted mt-1.5 text-[12.5px]">
            {dict.footer.builtWith}
          </p>
          <p className="text-faint mt-0.5 text-[12px]">
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
              className="border-line bg-surface text-muted hover:border-accent hover:text-accent grid h-[34px] w-[34px] place-items-center rounded-lg border transition-colors"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
