import type { Dictionary } from '@/lib/i18n';

interface HeroStats {
  posts: number;
  categories: number;
  since: number;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <dd className="text-ink order-1 font-mono text-[22px] font-bold">
        {value}
      </dd>
      <dt className="text-faint order-2 mt-0.5 text-[12px]">{label}</dt>
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
    <header className="border-line border-b">
      <div className="max-w-deck mx-auto px-[18px] py-9 md:px-[34px] md:py-[46px]">
        <p className="text-accent mb-3.5 font-mono text-[12px] tracking-[0.16em] uppercase">
          {dict.home.eyebrow}
        </p>
        <h1 className="text-ink w-full text-[clamp(26px,3.4vw,40px)] leading-[1.14] font-extrabold tracking-tight">
          {dict.home.heroTitlePre}
          <em className="text-accent not-italic">{dict.home.heroTitleEm}</em>
          {dict.home.heroTitlePost}
        </h1>
        <p className="text-muted mt-4 w-full text-[15.5px]">
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
