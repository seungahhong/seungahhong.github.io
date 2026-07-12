import type { Dictionary } from '@/lib/i18n';

interface HeroStats {
  posts: number;
  categories: number;
  since: number;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <dd className="order-1 font-mono text-[22px] font-bold text-ink">
        {value}
      </dd>
      <dt className="order-2 mt-0.5 text-[12px] text-faint">{label}</dt>
    </div>
  );
}

export default function Hero({
  dict,
  stats,
}: {
  dict: Dictionary;
  stats: HeroStats;
}) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto max-w-deck px-[18px] py-9 md:px-[34px] md:py-[46px]">
        <p className="mb-3.5 font-mono text-[12px] uppercase tracking-[0.16em] text-accent">
          {dict.home.eyebrow}
        </p>
        <h1 className="w-full text-[clamp(26px,3.4vw,40px)] font-extrabold leading-[1.14] tracking-tight text-ink">
          {dict.home.heroTitlePre}
          <em className="not-italic text-accent">{dict.home.heroTitleEm}</em>
          {dict.home.heroTitlePost}
        </h1>
        <p className="mt-4 w-full text-[15.5px] text-muted">
          {dict.home.heroSubtitle}
        </p>
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
          <Stat value={String(stats.posts)} label={dict.home.statPosts} />
          <Stat
            value={String(stats.categories)}
            label={dict.home.statCategories}
          />
          <Stat value={`${stats.since}–`} label={dict.home.statSince} />
        </dl>
      </div>
    </header>
  );
}
